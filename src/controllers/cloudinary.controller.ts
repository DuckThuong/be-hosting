import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt/jwt.guard';
import { CloudinaryUploadResponseDto } from '@dtos/upload.dto';
import { CloudinaryService } from '@services/cloudinary.service';

/**
 * Controller xử lý tất cả các luồng upload file lên Cloudinary.
 * Yêu cầu người dùng phải đăng nhập (JWT-auth) thì mới được phép upload.
 */
@ApiTags('Upload')
@Controller('upload')
@ApiBearerAuth('JWT-auth') // Yêu cầu token ở Swagger
@UseGuards(JwtAuthGuard)   // Bảo vệ tất cả API bằng JWT Guard
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * Endpoint 1: Upload Hình Ảnh (Image)
   * Sử dụng cho: Ảnh đại diện (avatar), ảnh bìa, ảnh trong bài viết...
   */
  @Post('image')
  @ApiOperation({ summary: 'Upload image to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image')) // Chặn và lấy file từ key 'image' của form-data
  async uploadImage(
    @UploadedFile() image: Express.Multer.File, // File đã được Multer phân tích
  ): Promise<CloudinaryUploadResponseDto> {
    // Chuyển việc xử lý chi tiết (check size, upload) cho CloudinaryService
    return await this.cloudinaryService.uploadImage(image);
  }

  /**
   * Endpoint 2: Upload Video
   * Sử dụng cho: Video bài giảng, video demo...
   */
  @Post('video')
  @ApiOperation({ summary: 'Upload video to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @UploadedFile() video: Express.Multer.File,
  ): Promise<CloudinaryUploadResponseDto> {
    return await this.cloudinaryService.uploadVideo(video);
  }

  /**
   * Endpoint 3: Upload Tài liệu, File thô (Raw File)
   * Sử dụng cho: Các loại file văn bản (PDF, DOCX, ZIP...)
   * Tính chất: Lưu nguyên bản, không nén, có thể tải về trực tiếp.
   */
  @Post('file')
  @ApiOperation({ summary: 'Upload file to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CloudinaryUploadResponseDto> {
    return await this.cloudinaryService.uploadFile(file);
  }
}
