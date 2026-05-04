import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TbLocation } from './location.entity';
import { TbUserDefault } from '../user/user_default.entity';

@Entity('tb_location-comment')
export class TbLocationComment extends BaseEntity {
  @Column({ type: 'varchar', length: 25, nullable: false })
  locationCode: string;

  @Column({ type: 'varchar', length: 25, nullable: false })
  userCode: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  content: string;

  @Column({ type: 'int', nullable: false })
  rate: number;

  @Column({ type: 'varchar' })
  metaData: string;

  // ── Relations ──

  @ManyToOne(() => TbLocation)
  @JoinColumn({ name: 'locationCode', referencedColumnName: 'locationCode' })
  location?: TbLocation;

  @ManyToOne(() => TbUserDefault)
  @JoinColumn({ name: 'userCode', referencedColumnName: 'userCode' })
  user?: TbUserDefault;

  @OneToMany(() => TbLocationCommentReply, (reply) => reply.parentComment)
  replies?: TbLocationCommentReply[];
}

@Entity('tb_location-comment-reply')
export class TbLocationCommentReply extends BaseEntity {
  @Column({ type: 'int', nullable: false })
  preCommentId: number;

  @Column({ type: 'varchar', length: 25, nullable: false })
  userCode: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  content: string;

  @Column({ type: 'int', nullable: false })
  rate: number;

  @Column({ type: 'varchar' })
  metaData: string;

  // ── Relations ──

  @ManyToOne(() => TbLocationComment, (comment) => comment.replies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'preCommentId' })
  parentComment?: TbLocationComment;

  @ManyToOne(() => TbUserDefault)
  @JoinColumn({ name: 'userCode', referencedColumnName: 'userCode' })
  user?: TbUserDefault;
}
