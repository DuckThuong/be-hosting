import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TbMessage } from './message.entity';

@Entity('tb_message_attachment')
@Index(['messageId'])
export class TbMessageAttachment extends BaseEntity {
  @Column({
    comment: 'ID tin nhắn sở hữu file đính kèm',
  })
  messageId: number;

  @Column({
    comment: 'Tên file hiển thị',
  })
  fileName: string;

  @Column({
    comment: 'MIME type của file',
  })
  mimeType: string;

  @Column({
    type: 'bigint',
    comment: 'Kích thước file theo byte',
  })
  size: number;

  @Column({
    comment: 'URL public của file',
  })
  url: string;

  @Column({
    nullable: true,
    comment: 'Khóa lưu trữ nội bộ của file',
  })
  storageKey?: string;

  @Column({
    nullable: true,
    comment: 'Chiều rộng của ảnh nếu có',
  })
  width?: number;

  @Column({
    nullable: true,
    comment: 'Chiều cao của ảnh nếu có',
  })
  height?: number;

  // ── Relations ──

  @ManyToOne(() => TbMessage, (message) => message.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'messageId' })
  message: TbMessage;
}
