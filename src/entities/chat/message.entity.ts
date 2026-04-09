import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TbMessageAttachment } from './message_attachment.entity';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

@Entity('tb_message')
@Index(['conversationId', 'id'])
@Index(['senderId'])
export class TbMessage {
  @PrimaryGeneratedColumn('increment', {
    comment: 'Khóa chính của tin nhắn',
  })
  id: number;

  @Column({
    comment: 'ID cuộc trò chuyện chứa tin nhắn này',
  })
  conversationId: number;

  @Column({
    comment: 'ID người gửi tin nhắn',
  })
  senderId: number;

  @Column({
    nullable: true,
    comment: 'URL avatar của người gửi',
  })
  senderAvatarUrl?: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
    comment: 'Loại tin nhắn',
  })
  type: MessageType;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Nội dung tin nhắn dạng văn bản',
  })
  content?: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Dữ liệu bổ sung của tin nhắn',
  })
  metadata?: Record<string, unknown> | null;

  @Column({
    nullable: true,
    comment: 'ID của tin nhắn được trả lời (nếu có)',
  })
  replyToMessageId?: number;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.SENT,
    comment: 'Trạng thái của tin nhắn',
  })
  status: MessageStatus;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Thời điểm chỉnh sửa tin nhắn',
  })
  editedAt?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Thời điểm xóa mềm tin nhắn',
  })
  deletedAt?: Date;

  @Column({
    nullable: true,
    comment: 'Người thực hiện xóa mềm tin nhắn',
  })
  deletedByUserId?: number;

  @OneToMany(() => TbMessageAttachment, (attachment) => attachment.message)
  attachments?: TbMessageAttachment[];

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Thời điểm gửi tin nhắn',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Thời điểm cập nhật tin nhắn',
  })
  updatedAt: Date;
}
