import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import cloudinary, {
  configureCloudinary,
} from '../common/cloudinary/cloudinary.config';
import { CloudinaryUploadResponseDto } from '../dtos/upload.dto';
import { RESOURCE_TYPE } from '../assests/constants/constants';

interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export class SuccessUploadMessage {
  static readonly IMAGE_UPLOADED = 'Image uploaded successfully';
  static readonly FILE_PROCESSED = 'File processed successfully';
  static readonly UPLOAD_COMPLETED = 'Upload completed successfully';
}

export class ErrorUploadMessage {
  static readonly FILE_REQUIRED = 'File is required';
  static readonly FILE_BUFFER_MISSING = 'File buffer is missing';
  static readonly UPLOAD_FAILED = 'Failed to upload image to Cloudinary';
  static readonly INVALID_FILE_TYPE = 'Invalid file type';
  static readonly FILE_TOO_LARGE = 'File size exceeds the limit';
  static readonly CLOUDINARY_ERROR = 'Cloudinary service error';
  static readonly NETWORK_ERROR = 'Network error occurred during upload';
}

@Injectable()
export class CloudinaryService {
  constructor() {
    configureCloudinary();
  }

  public async uploadImage(
    file: FileUpload,
  ): Promise<CloudinaryUploadResponseDto> {
    if (!file || !file.buffer) {
      throw new HttpException(
        ErrorUploadMessage.FILE_REQUIRED,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: file.fieldname,
              resource_type: RESOURCE_TYPE,
            },
            (error, result) => {
              if (error) return reject(new Error(error.message));
              if (!result)
                return reject(new Error(ErrorUploadMessage.UPLOAD_FAILED));
              resolve(result);
            },
          )
          .end(file.buffer);
      });

      return new CloudinaryUploadResponseDto({
        message: SuccessUploadMessage.IMAGE_UPLOADED,
        imageUrl: result.secure_url,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        ErrorUploadMessage.UPLOAD_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
