import { ApiProperty } from '@nestjs/swagger';

export class MetaDataDto {
  @ApiProperty({
    description: 'id',
    example: '',
    required: false,
  })
  id: number;

  @ApiProperty({
    description: 'url',
    example: '',
    required: false,
  })
  url: string;
}

export class ChatAndCommentDto {
  @ApiProperty({
    description: 'content',
    example: '',
    required: false,
  })
  content: string;

  @ApiProperty({
    description: 'ratevalue',
    example: '',
    required: false,
  })
  ratevalue?: number;

  @ApiProperty({
    type: [MetaDataDto],
  })
  metaData: MetaDataDto[];
}

export class LocationCommentPayloadDto {
  @ApiProperty({
    description: 'type',
    example: '',
    required: false,
  })
  type: number;

  @ApiProperty({
    description: 'type',
    example: '',
    required: false,
  })
  commentId: number;

  @ApiProperty({
    description: 'locationCode',
    example: '',
    required: false,
  })
  locationCode: string;

  @ApiProperty({
    type: [ChatAndCommentDto],
  })
  content: ChatAndCommentDto;
}

export class GetAllCommentDto {
  @ApiProperty({
    description: 'Mã địa điểm',
    example: 'LOC001',
    required: true,
  })
  locationCode: string;

  @ApiProperty({
    description: 'Trang hiện tại',
    example: 1,
    required: false,
    default: 1,
  })
  page?: number;

  @ApiProperty({
    description: 'Số lượng comment mỗi trang',
    example: 10,
    required: false,
    default: 10,
  })
  limit?: number;
}

export class CommentUserResponseDto {
  @ApiProperty({ example: 'USR001' })
  code: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  name: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/150?img=1' })
  avatar: string;
}

export class CommentReplyResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Mình cũng thấy vậy 👍' })
  content: string;

  @ApiProperty({ example: 5 })
  rate: number;

  @ApiProperty({ example: 'REPLY' })
  type: string;

  @ApiProperty({ example: 'REPLY' })
  metaData: string;

  @ApiProperty({ example: '2026-04-03T10:20:00Z' })
  createdAt: Date;

  @ApiProperty({ type: CommentUserResponseDto })
  user: CommentUserResponseDto;
}

export class CommentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Địa điểm rất đẹp, đáng để ghé thăm!' })
  content: string;

  @ApiProperty({ example: 5 })
  rate: number;

  @ApiProperty({ example: 'REVIEW' })
  type: string;

  @ApiProperty({ example: '2026-04-03T10:15:00Z' })
  createdAt: Date;

  @ApiProperty({ type: CommentUserResponseDto })
  user: CommentUserResponseDto;

  @ApiProperty({ type: [CommentReplyResponseDto] })
  replies: CommentReplyResponseDto[];

  @ApiProperty({ example: 2 })
  totalReplies: number;
}

export class MetaResponseDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

export class GetAllCommentResponseDto {
  @ApiProperty({ type: [CommentResponseDto] })
  data: CommentResponseDto[];

  @ApiProperty({ type: MetaResponseDto })
  meta: MetaResponseDto;
}
