import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TbLocation } from './location.entity';

@Entity('tb_location-type')
export class TbLocationType extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  typeCode: string;

  @Column({ type: 'varchar', length: 50, unique: false })
  typeName: string;

  @Column({ type: 'varchar', length: 2000, unique: false, nullable: true })
  typeDescription: string;

  @Column({ type: 'varchar', length: 2000, unique: false, nullable: true })
  typeLogo: string;

  @Column({ type: 'varchar', length: 2000, unique: false, nullable: true })
  typeBackGround: string;

  // ── Relations ──

  @OneToMany(() => TbLocation, (location) => location.type)
  locations?: TbLocation[];
}
