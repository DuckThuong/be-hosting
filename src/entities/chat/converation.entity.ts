import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ConversationType {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
}

@Entity('tb_conversation')
export class TbConversation {
  @PrimaryGeneratedColumn({
    comment: 'Khóa chính của cuộc trò chuyện (định danh duy nhất)',
  })
  id: number;

  @Column({
    type: 'enum',
    enum: ConversationType,
    default: ConversationType.PRIVATE,
    comment: 'Loại cuộc trò chuyện: PRIVATE (1-1) hoặc GROUP (nhóm)',
  })
  type: ConversationType;

  @Column({
    nullable: true,
    comment: 'Tên cuộc trò chuyện (chỉ dùng cho nhóm)',
  })
  name?: string;

  @Column({
    nullable: true,
    comment: 'Đường dẫn ảnh đại diện của cuộc trò chuyện (nhóm)',
  })
  avatar?: string;

  @Column({
    nullable: true,
    comment: 'Nội dung tin nhắn cuối cùng (lưu cache để load danh sách nhanh)',
  })
  lastMessage?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Thời điểm gửi tin nhắn cuối cùng',
  })
  lastMessageAt?: Date;

  @Column({
    nullable: true,
    comment: 'Loại tin nhắn cuối cùng (lưu cache để load danh sách nhanh)',
  })
  lastMessageType?: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Thời điểm tạo cuộc trò chuyện',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Thời điểm cập nhật gần nhất (tự động cập nhật khi có thay đổi)',
  })
  updatedAt: Date;
}
