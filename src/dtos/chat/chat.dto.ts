import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConversationStatus } from '../../entities/chat/conversation.entity';
import { MessageType } from '../../entities/chat/message.entity';
import { UserResponseDto } from '../user/user.dto';
import { MessageAttachmentPayloadDto } from './message.dto';

export enum PublicConversationType {
  RENT = 'RENT',
  CONTACT = 'CONTACT',
  NORMAL = 'NORMAL',
}

export enum MuteConversationPreset {
  FIFTEEN_MINUTES = '15m',
  ONE_HOUR = '1h',
  EIGHT_HOURS = '8h',
  TWENTY_FOUR_HOURS = '24h',
  NO_END_TIME_YET = 'no end time yet',
}

export class ContactToUserPayloadDto {
  @ApiProperty({
    description: 'Người nhận tin nhắn',
    example: 2,
  })
  toUserId: number;

  @ApiPropertyOptional({
    description: 'Mã người nhận tin nhắn',
    example: 'USR001',
  })
  toUserCd?: string;

  @ApiPropertyOptional({
    description: 'Phân loại tin nhắn khởi tạo',
    example: 'CONTACT',
  })
  type?: string;

  @ApiPropertyOptional({
    description: 'Mã địa điểm liên quan',
    example: 'LOC001',
  })
  locationCd?: string;
}

export class ContactToUserDto {
  fromUser: UserResponseDto;
  toUserId: number;
  type?: string;
  locationCd?: string;
}

export class SendMessageAttachmentDto implements MessageAttachmentPayloadDto {
  @ApiProperty({ example: 'room-photo.jpg' })
  fileName: string;

  @ApiProperty({ example: 'image/jpeg' })
  mimeType: string;

  @ApiProperty({ example: 102400 })
  size: number;

  @ApiProperty({ example: 'https://example.com/files/room-photo.jpg' })
  url: string;

  @ApiPropertyOptional({ example: 'chat/room-photo.jpg' })
  storageKey?: string;

  @ApiPropertyOptional({ example: 1280 })
  width?: number;

  @ApiPropertyOptional({ example: 720 })
  height?: number;
}

export class SendMessageDto {
  @ApiProperty({ description: 'ID cuộc trò chuyện', example: 1 })
  conversationId: number;

  @ApiPropertyOptional({
    description: 'Nội dung tin nhắn',
    example: 'Xin chào!',
  })
  content?: string;

  @ApiPropertyOptional({ enum: MessageType, example: MessageType.TEXT })
  type?: MessageType;

  @ApiPropertyOptional({ example: 10 })
  replyToMessageId?: number;

  @ApiPropertyOptional({
    type: () => [SendMessageAttachmentDto],
    description: 'Danh sách file đính kèm',
  })
  attachments?: SendMessageAttachmentDto[];
}

export class MarkConversationReadDto {
  @ApiProperty({ description: 'ID cuộc trò chuyện', example: 1 })
  conversationId: number;

  @ApiPropertyOptional({
    description:
      'ID tin nhắn cuối đã đọc, mặc định lấy tin mới nhất của cuộc trò chuyện',
    example: 99,
  })
  messageId?: number;
}

export class SetConversationNicknameDto {
  @ApiProperty({ description: 'ID cuộc trò chuyện', example: 1 })
  conversationId: number;

  @ApiPropertyOptional({
    description: 'Biệt danh cuộc trò chuyện theo user hiện tại',
    example: 'Chủ trọ quận 7',
    nullable: true,
  })
  nickname?: string | null;
}

export class PinConversationDto {
  @ApiProperty({ description: 'ID cuộc trò chuyện', example: 1 })
  conversationId: number;

  @ApiProperty({
    description: 'Trạng thái ghim cuộc trò chuyện',
    example: true,
  })
  isPinned: boolean;
}

export class MuteConversationDto {
  @ApiProperty({ description: 'ID cuộc trò chuyện', example: 1 })
  conversationId: number;

  @ApiProperty({
    enum: MuteConversationPreset,
    example: MuteConversationPreset.EIGHT_HOURS,
  })
  preset: MuteConversationPreset;
}

export class ChatResponseDto {
  @ApiProperty({ example: 1, nullable: true })
  conversationId?: number;

  @ApiProperty({
    enum: PublicConversationType,
    example: PublicConversationType.NORMAL,
    nullable: true,
  })
  conversationType?: PublicConversationType;

  @ApiProperty({
    enum: ConversationStatus,
    example: ConversationStatus.ACTIVE,
    nullable: true,
  })
  conversationStatus?: ConversationStatus;

  @ApiProperty({ example: 'Cuộc trò chuyện giữa A và B', nullable: true })
  conversationName?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
  conversationAvatar?: string;

  @ApiProperty({ example: 'Xin chào!', nullable: true })
  lastMessagePreview?: string;

  @ApiProperty({ example: 5, nullable: true })
  lastMessageId?: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', nullable: true })
  lastMessageAt?: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', nullable: true })
  conversationCreatedAt?: Date;

  @ApiProperty({ example: 1, nullable: true })
  messageId?: number;

  @ApiProperty({ example: 1, nullable: true })
  senderId?: number;

  @ApiProperty({ enum: MessageType, example: MessageType.TEXT, nullable: true })
  messageType?: MessageType;

  @ApiProperty({ example: 'Xin chào!', nullable: true })
  content?: string;

  @ApiProperty({ example: null, nullable: true })
  metadata?: Record<string, unknown> | null;

  @ApiProperty({ example: null, nullable: true })
  deletedAt?: Date | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', nullable: true })
  messageCreatedAt?: Date;

  @ApiProperty({ example: 1, nullable: true })
  page?: number;

  @ApiProperty({ example: 20, nullable: true })
  limit?: number;

  @ApiProperty({ example: 100, nullable: true })
  total?: number;

  @ApiProperty({ type: () => [ChatResponseDto], nullable: true })
  data?: ChatResponseDto[];
}

export class ParticipantDto {
  id: number;
  conversationId: number;
  userId: number;
  unreadCount: number;
  lastReadMessageId: number | null;
  lastReadAt: Date | null;
  muteUntil: Date | null;
  isPinned: boolean;
  nickname?: string | null;
  deletedAt: Date | null;
  joinedAt: Date;
}

export class ConversationResponseDto {
  conversationId: number;
  conversationType: PublicConversationType;
  conversationStatus: ConversationStatus;
  conversationName: string | null;
  conversationAvatar: string | null;
  lastMessageId: number | null;
  lastMessagePreview: string | null;
  lastMessageAt: Date | null;
  lastMessageType: MessageType | null;
  conversationCreatedAt: Date;
  unreadCount: number;
  lastReadMessageId: number | null;

  participants: ParticipantDto[];

  toUser: UserResponseDto | null;
}
