import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
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
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
    comment: 'Loại tin nhắn: TEXT, IMAGE, FILE, SYSTEM',
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
    comment:
      'Dữ liệu bổ sung (ví dụ: imageUrl, fileUrl, kích thước, metadata...)',
  })
  metadata?: any;

  @Column({
    default: false,
    comment: 'Trạng thái xóa tin nhắn (xóa cho tất cả thành viên)',
  })
  isDeleted: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Thời điểm gửi tin nhắn',
  })
  createdAt: Date;
}
