import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageType } from './message.entity';

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
export class TbConversation {
  @PrimaryGeneratedColumn({
    comment: 'Khóa chính của cuộc trò chuyện',
  })
  id: number;

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

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Thời điểm tạo cuộc trò chuyện',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Thời điểm cập nhật gần nhất',
  })
  updatedAt: Date;
}
