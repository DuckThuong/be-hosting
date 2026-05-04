import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TbMessageAttachment } from './message_attachment.entity';
import { TbConversation } from './conversation.entity';
import { MessageType, MessageStatus } from '../../assets/enums/message.enum';


@Entity('tb_message')
@Index(['conversationId', 'id'])
@Index(['senderId'])
export class TbMessage extends BaseEntity {
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
    nullable: true,
    comment: 'Người thực hiện xóa mềm tin nhắn',
  })
  deletedByUserId?: number;

  // ── Relations ──

  @ManyToOne(() => TbConversation, (c) => c.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversationId' })
  conversation?: TbConversation;

  @OneToMany(() => TbMessageAttachment, (attachment) => attachment.message)
  attachments?: TbMessageAttachment[];
}
