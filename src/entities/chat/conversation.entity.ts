import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TbConversationParticipant } from './conversation_participant.entity';
import { MessageType } from '../../assets/enums/message.enum';
import { TbMessage } from './message.entity';

export enum ConversationType {
  RENT = 'RENT',
  CONTACT = 'CONTACT',
  NORMAL = 'NORMAL',
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
}

export enum ConversationStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  BLOCKED = 'BLOCKED',
}

@Entity('tb_conversation')
export class TbConversation extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ConversationType,
    default: ConversationType.NORMAL,
    comment: 'Loại cuộc trò chuyện, v1 chỉ dùng NORMAL',
  })
  type: ConversationType;

  @Column({
    nullable: true,
    comment: 'Tên hiển thị được cache nếu cần',
  })
  name?: string;

  @Column({
    nullable: true,
    comment: 'Ảnh đại diện được cache nếu cần',
  })
  avatar?: string;

  @Column({
    nullable: true,
    comment: 'Nội dung preview của tin nhắn cuối cùng',
  })
  lastMessagePreview?: string;

  @Column({
    nullable: true,
    comment: 'ID của tin nhắn cuối cùng',
  })
  lastMessageId?: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Thời điểm gửi tin nhắn cuối cùng',
  })
  lastMessageAt?: Date;

  @Column({
    type: 'enum',
    enum: MessageType,
    nullable: true,
    comment: 'Loại tin nhắn cuối cùng',
  })
  lastMessageType?: MessageType;

  @Column({
    comment: 'Người tạo cuộc trò chuyện',
  })
  createdByUserId: number;

  @Column({
    type: 'enum',
    enum: ConversationStatus,
    default: ConversationStatus.ACTIVE,
    comment: 'Trạng thái cuộc trò chuyện',
  })
  status: ConversationStatus;

  // ── Relations ──

  @OneToMany(() => TbConversationParticipant, (p) => p.conversation)
  participants?: TbConversationParticipant[];

  @OneToMany(() => TbMessage, (m) => m.conversation)
  messages?: TbMessage[];
}
