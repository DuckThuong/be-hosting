import { MessageType, MessageStatus } from '../../assets/enums/message.enum';

export interface MessageAttachmentPayloadDto {
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  storageKey?: string;
  width?: number;
  height?: number;
}

export interface MessagePayloadDto {
  senderAvatarUrl?: string;
  conversationId: number;
  senderId: number;
  content?: string;
  type: MessageType;
  metadata?: Record<string, unknown> | null;
  replyToMessageId?: number;
  status?: MessageStatus;
  attachments?: MessageAttachmentPayloadDto[];
}

export enum MessageTypeEnum {
  RENT = 'RENT',
  CONTACT = 'CONTACT',
  NORMAL = 'NORMAL',
}
