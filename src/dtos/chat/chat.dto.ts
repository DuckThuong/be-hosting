import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '../../entities/chat/message.entity';
import { ConversationType } from '../../entities/chat/converation.entity';
import { UserDecoratorDtoResponse, UserResponseDto } from '../user/user.dto';

export class ContactToUserPayloadDto {
  @ApiProperty({
    description: 'Người nhận tin nhắn',
    example: 'toUserId',
    required: true,
    maxLength: 50,
  })
  toUserId: number;
}
export class ContactToUserDto {
  fromUser: UserDecoratorDtoResponse;

  @ApiProperty({
    description: 'Người nhận tin nhắn',
    example: 'toUserId',
    required: true,
    maxLength: 50,
  })
  toUserId: number;
}

export class SendMessageDto {
  @ApiProperty({ description: 'ID cuộc trò chuyện', example: 1 })
  conversationId: number;

  @ApiProperty({ description: 'Nội dung tin nhắn', example: 'Xin chào!' })
  content: string;
}

export class ChatResponseDto {
  @ApiProperty({ example: 1, nullable: true })
  conversationId?: number;

  @ApiProperty({
    enum: ConversationType,
    example: ConversationType.PRIVATE,
    nullable: true,
  })
  conversationType?: ConversationType;

  @ApiProperty({ example: 'Cuộc trò chuyện giữa A và B', nullable: true })
  conversationName?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
  conversationAvatar?: string;

  @ApiProperty({ example: 'Xin chào!', nullable: true })
  lastMessage?: string;

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
  metadata?: any;

  @ApiProperty({ example: false, nullable: true })
  isDeleted?: boolean;

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
  isMuted: boolean;
  isPinned: boolean;
  isDeleted: boolean;
}
export class ConversationResponseDto {
  conversationId: number;
  conversationType: string;
  conversationName: string;
  conversationAvatar: string;
  lastMessage: string;
  lastMessageAt: Date;
  conversationCreatedAt: Date;

  participants: ParticipantDto[];

  toUser: UserResponseDto;
}
