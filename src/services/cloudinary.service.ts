import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { extname } from 'path';
import cloudinary, {
  configureCloudinary,
} from '@common/cloudinary/cloudinary.config';
import { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { CloudinaryUploadResponseDto } from '@dtos/upload.dto';
import { SuccessUploadMessage, ErrorUploadMessage } from '@assets/messages/upload.message';
import { FileUpload } from '@assets/interface/cloudinary.interface';


@Injectable()
export class CloudinaryService {
  constructor() {
    configureCloudinary();
  }

  /**
   * Xác định loại tài nguyên (resource_type) trên Cloudinary dựa vào mimetype.
   * Cloudinary hỗ trợ 3 loại chính: 'image', 'video' (bao gồm cả audio), và 'raw' (các file khác như pdf, docx, zip...)
   */
  private resolveResourceType(mimeType: string): 'image' | 'video' | 'raw' {
    if (mimeType?.startsWith('image/')) {
      return 'image';
    }
    if (mimeType?.startsWith('video/') || mimeType?.startsWith('audio/')) {
      return 'video';
    }
    return 'raw';
  }

  /**
   * Xây dựng tên file (public_id) an toàn cho các file loại 'raw'.
   * Giúp loại bỏ các ký tự đặc biệt, dấu cách để tránh lỗi khi lưu trên Cloudinary.
   */
  private buildRawPublicId(originalName: string): string {
    const extension = extname(originalName || '').toLowerCase(); // Lấy đuôi file (vd: .pdf)
    const baseName = (originalName || 'file')
      .replace(extension, '') // Tách lấy tên gốc
      .trim()
      .replaceAll(/[^a-zA-Z0-9-_]+/g, '-') // Thay ký tự đặc biệt bằng dấu gạch ngang
      .replaceAll(/-+/g, '-')
      .replaceAll(/^-|-$/g, '') || 'file';

    // Trả về tên file kèm timestamp - đảm bảo tính duy nhất
    return `${Date.now()}-${baseName}${extension}`;
  }

  /**
   * Hàm Core (cốt lõi) xử lý việc stream file lên Cloudinary.
   * Tất cả các hàm upload cụ thể (image, video, raw) đều sẽ gọi qua hàm này.
   * Sử dụng upload_stream giúp tiết kiệm RAM do không phải lưu file tạm xuống ổ cứng.
   */
  public async uploadMedia(file: FileUpload, folder: string): Promise<string> {
    if (!file?.buffer) {
      throw new HttpException(
        ErrorUploadMessage.FILE_REQUIRED,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      //  Phân loại file để báo cho Cloudinary biết cách xử lý
      const resourceType = this.resolveResourceType(file.mimetype);
      
      //  Cấu hình các tuỳ chọn cơ bản
      const uploadOptions: UploadApiOptions = {
        folder, // Lưu vào thư mục tương ứng trên Cloud
        resource_type: resourceType,
      };

      //  Xử lý riêng cho file raw (tài liệu, file nén...)
      // File raw cần phải giữ nguyên định dạng và tên file
      if (resourceType === 'raw') {
        uploadOptions.public_id = this.buildRawPublicId(file.originalname);
        uploadOptions.use_filename = true;
        uploadOptions.unique_filename = false;
        uploadOptions.filename_override = file.originalname;
      }

      // Mở luồng kết nối và đẩy file lên Cloudinary
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            uploadOptions,
            (error, result) => {
              if (error) return reject(new Error(error.message));
              if (!result) return reject(new Error(ErrorUploadMessage.UPLOAD_FAILED));
              resolve(result); 
            },
          )
          .end(file.buffer); // Truyền dữ liệu dạng nhị phân (buffer) vào stream
      });

      if (!result.secure_url) {
        throw new Error(ErrorUploadMessage.UPLOAD_FAILED);
      }

      // Trả về đường dẫn HTTPS của file đã upload
      return result.secure_url;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        ErrorUploadMessage.UPLOAD_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Upload hình ảnh (Avatar, Cover, Ảnh bài viết...)
   */
  public async uploadImage(
    file: FileUpload,
  ): Promise<CloudinaryUploadResponseDto> {
    // 1. Kiểm tra định dạng (Chỉ cho phép ảnh)
    const allowedImageTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 
      'image/gif', 'image/webp', 'image/svg+xml'
    ];

    if (!allowedImageTypes.includes(file.mimetype)) {
      throw new HttpException(ErrorUploadMessage.INVALID_FILE_TYPE, HttpStatus.BAD_REQUEST);
    }

    // 2. Giới hạn 10MB
    if (file.size > 10 * 1024 * 1024) {
      throw new HttpException(ErrorUploadMessage.FILE_TOO_LARGE, HttpStatus.BAD_REQUEST);
    }

    // 3. Gọi hàm Core để thực hiện upload
    const mediaUrl = await this.uploadMedia(file, file.fieldname);

    // 4. Trả về kết quả
    return new CloudinaryUploadResponseDto({
      message: SuccessUploadMessage.IMAGE_UPLOADED,
      imageUrl: mediaUrl,
    });
  }

  /**
   * Upload Video (Optional - Cấu trúc tương tự Image)
   */
  public async uploadVideo(
    file: FileUpload,
  ): Promise<CloudinaryUploadResponseDto> {
    if (!file.mimetype.startsWith('video/')) {
      throw new HttpException(ErrorUploadMessage.INVALID_FILE_TYPE, HttpStatus.BAD_REQUEST);
    }

    // Giới hạn 100 MB
    if (file.size > 100 * 1024 * 1024) {
      throw new HttpException(ErrorUploadMessage.FILE_TOO_LARGE, HttpStatus.BAD_REQUEST);
    }

    const mediaUrl = await this.uploadMedia(file, file.fieldname);

    return new CloudinaryUploadResponseDto({
      message: SuccessUploadMessage.UPLOAD_COMPLETED,
      imageUrl: mediaUrl,
    });
  }

  /**
   * Upload tài liệu (PDF, DOCX...) - Định dạng Raw
   */
  public async uploadFile(
    file: FileUpload,
  ): Promise<CloudinaryUploadResponseDto> {
    // Giới hạn 20MB
    if (file.size > 20 * 1024 * 1024) {
      throw new HttpException(ErrorUploadMessage.FILE_TOO_LARGE, HttpStatus.BAD_REQUEST);
    }

    const mediaUrl = await this.uploadMedia(file, file.fieldname);

    return new CloudinaryUploadResponseDto({
      message: SuccessUploadMessage.FILE_PROCESSED,
      imageUrl: mediaUrl, 
    });
  }
}
