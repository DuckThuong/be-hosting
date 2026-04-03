import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('tb_conversation_participant')
@Index(['conversationId', 'userId'], { unique: true })
@Index(['userId'])
export class TbConversationParticipant {
  @PrimaryGeneratedColumn({
    comment: 'Khóa chính của bản ghi người tham gia cuộc trò chuyện',
  })
  id: number;

  @Column({
    comment: 'ID cuộc trò chuyện mà người dùng tham gia',
  })
  conversationId: number;

  @Column({
    comment: 'ID người dùng tham gia cuộc trò chuyện',
  })
  userId: number;

  @Column({
    default: 0,
    comment: 'Số lượng tin nhắn chưa đọc của người dùng trong cuộc trò chuyện',
  })
  unreadCount: number;

  @Column({
    type: 'bigint',
    nullable: true,
    comment: 'ID tin nhắn cuối cùng mà người dùng đã đọc',
  })
  lastReadMessageId?: number;

  @Column({
    default: false,
    comment: 'Trạng thái tắt thông báo của người dùng đối với cuộc trò chuyện',
  })
  isMuted: boolean;

  @Column({
    default: false,
    comment: 'Trạng thái ghim cuộc trò chuyện lên đầu danh sách',
  })
  isPinned: boolean;

  @Column({
    default: false,
    comment: 'Trạng thái ẩn/xóa cuộc trò chuyện phía người dùng (soft delete)',
  })
  isDeleted: boolean;
}
