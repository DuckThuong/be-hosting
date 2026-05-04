import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TbConversation } from './conversation.entity';

@Entity('tb_conversation_participant')
@Index(['conversationId', 'userId'], { unique: true })
@Index(['userId'])
export class TbConversationParticipant extends BaseEntity {
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
    type: 'timestamp',
    nullable: true,
    comment: 'Thời điểm đọc tin nhắn gần nhất',
  })
  lastReadAt?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Thời điểm tắt thông báo đến',
  })
  muteUntil?: Date;

  @Column({
    default: false,
    comment: 'Trạng thái ghim cuộc trò chuyện lên đầu danh sách',
  })
  isPinned: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Biệt danh cuộc trò chuyện theo từng người dùng',
  })
  nickname?: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Thời điểm tham gia cuộc trò chuyện (legacy)',
  })
  joinedAt?: Date;

  // ── Relations ──

  @ManyToOne(() => TbConversation, (c) => c.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversationId' })
  conversation?: TbConversation;
}
