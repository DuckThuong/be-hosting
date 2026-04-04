import { TbMessage } from '../../entities/chat/message.entity';

export class MessageResponseDto {
  id: number;
  conversationId: number;
  senderId: number;
  senderAvatarUrl?: string;
  type: string;
  content?: string | null;
  status?: string;
  replyToMessageId?: number | null;
  metadata?: Record<string, unknown> | null;
  editedAt?: Date | null;
  deletedAt?: Date | null;
  deletedByUserId?: number | null;
  createdAt: Date;
  updatedAt?: Date;

  public static fromEntity(message: TbMessage): MessageResponseDto {
    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderAvatarUrl: message.senderAvatarUrl,
      type: message.type,
      content: message.content ?? null,
      status: message.status,
      replyToMessageId: message.replyToMessageId ?? null,
      metadata: message.metadata ?? null,
      editedAt: message.editedAt ?? null,
      deletedAt: message.deletedAt ?? null,
      deletedByUserId: message.deletedByUserId ?? null,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }
}
