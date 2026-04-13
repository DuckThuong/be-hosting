import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tb_location-comment')
export class TbLocationComment {
  @PrimaryGeneratedColumn('increment', {
    comment: 'Primary key',
  })
  id: number;

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

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;
}

@Entity('tb_location-comment-reply')
export class TbLocationCommentReply {
  @PrimaryGeneratedColumn('increment', {
    comment: 'Primary key',
  })
  id: number;

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

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;
}
