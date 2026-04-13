import { ConversationResponseDto } from './chat.dto';
import { MessageResponseDto } from './message-response.dto';
import { MessageStatus, MessageType } from '../../entities/chat/message.entity';

export interface SocketEventMetaDto {
  requestId?: string;
  conversationId?: number;
  sentAt: string;
  version: number;
}

export interface SocketEventEnvelopeDto<T> {
  event: string;
  data: T;
  meta: SocketEventMetaDto;
}

export interface SocketAckDto<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
  requestId?: string;
}

export interface ChatJoinLeavePayloadDto {
  conversationId: number;
}

export interface MarkMessageReadSocketPayloadDto {
  conversationId: number;
  messageId?: number;
  requestId?: string;
}

export interface SendMessageSocketPayloadDto {
  conversationId: number;
  content?: string;
  type?: MessageType;
  replyToMessageId?: number;
  attachments?: Array<{
    fileName: string;
    mimeType: string;
    size: number;
    url: string;
    storageKey?: string;
    width?: number;
    height?: number;
  }>;
  requestId?: string;
}

export type MessageSentEventDto = SocketEventEnvelopeDto<MessageResponseDto>;
export type ConversationUpdatedEventDto =
  SocketEventEnvelopeDto<ConversationResponseDto>;

export interface MessageStatusUpdatedPayloadDto {
  conversationId: number;
  messageId: number;
  status: MessageStatus;
  updatedAt: string;
  actorUserId?: number;
}

export type MessageStatusUpdatedEventDto =
  SocketEventEnvelopeDto<MessageStatusUpdatedPayloadDto>;
