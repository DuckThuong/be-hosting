import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TbLocation } from './location.entity';

export enum LocationMediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

@Entity('tb_location-media')
export class TbLocationMedia {
  @PrimaryGeneratedColumn('increment', {
    comment: 'Primary key',
  })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  mediaCode: string;

  @Column({ type: 'varchar', length: 25 })
  locationCode: string;

  @Column({ type: 'varchar', length: 2000 })
  mediaUrl: string;

  @Column({
    type: 'enum',
    enum: LocationMediaType,
    default: LocationMediaType.IMAGE,
  })
  mediaType: LocationMediaType;

  @Column({ type: 'int', default: 1 })
  displayOrder: number;

  @Column({ type: 'tinyint', default: 0 })
  isLogo: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => TbLocation, (location) => location.media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'locationCode', referencedColumnName: 'locationCode' })
  location?: TbLocation;
}
