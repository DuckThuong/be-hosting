import { MessageType } from '../../entities/chat/message.entity';

export interface MessagePayloadDto {
  avartarUrl?: string;
  conversationId: number;
  senderId: number;
  content: string;
  type: MessageType;
  metaData: string;
}

export enum MessageTypeEnum {
  RENT = 'RENT',
  CONTACT = 'CONTACT',
  NORMAL = 'NORMAL',
}
