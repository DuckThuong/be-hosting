import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TbMessage } from './message.entity';

@Entity('tb_message_attachment')
@Index(['messageId'])
export class TbMessageAttachment {
  @PrimaryGeneratedColumn({
    comment: 'Khóa chính của file đính kèm',
  })
  id: number;

  @Column({
    comment: 'ID tin nhắn sở hữu file đính kèm',
  })
  messageId: number;

  @ManyToOne(() => TbMessage, (message) => message.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'messageId' })
  message: TbMessage;

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

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Thời điểm tạo file đính kèm',
  })
  createdAt: Date;
}
