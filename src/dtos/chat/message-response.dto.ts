import { TbMessage } from '../../entities/chat/message.entity';

export interface MessageAttachmentResponseDto {
  id: number;
  messageId: number;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  storageKey?: string;
  width?: number;
  height?: number;
  createdAt: Date;
}

export class MessageResponseDto {
  id: number;
  conversationId: number;
  senderId: number;
  senderAvatarUrl?: string;
  type: string;
  content?: string | null;
  status?: string;
  replyToMessageId?: number | null;
  attachments?: MessageAttachmentResponseDto[];
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
      attachments:
        message.attachments?.map((attachment) => ({
          id: attachment.id,
          messageId: attachment.messageId,
          fileName: attachment.fileName,
          mimeType: attachment.mimeType,
          size: attachment.size,
          url: attachment.url,
          storageKey: attachment.storageKey,
          width: attachment.width,
          height: attachment.height,
          createdAt: attachment.createdAt,
        })) ?? [],
      metadata: message.metadata ?? null,
      editedAt: message.editedAt ?? null,
      deletedAt: message.deletedAt ?? null,
      deletedByUserId: message.deletedByUserId ?? null,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }
}
