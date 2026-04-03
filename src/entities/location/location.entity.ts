import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TbLocationMedia } from './locationMedia.entity';

@Entity('tb_location')
export class TbLocation {
  @PrimaryGeneratedColumn('increment', {
    comment: 'Primary key',
  })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: false })
  typeCode: string;

  @Column({ type: 'varchar', length: 100, unique: false })
  locationName: string;

  @Column({ type: 'varchar', length: 250, unique: false })
  locationLogo: string;

  @Column({ type: 'varchar', length: 100, unique: false })
  ownerCode: string;

  @Column({ type: 'varchar', length: 25, unique: true })
  locationCode: string;

  @Column({ type: 'varchar', unique: false, nullable: true })
  minTimeLimit: string;

  @Column({ type: 'varchar', unique: false, nullable: true })
  maxTimeLimit: string;

  @Column({ type: 'decimal', unique: false, nullable: true })
  locationPriceStart: number;

  @Column({ type: 'decimal', unique: false, nullable: true })
  locationPriceEnd: number;

  @Column({ type: 'decimal', unique: false, nullable: true })
  locationPriceAfterDeal: number;

  @Column({ type: 'decimal', unique: false, nullable: true })
  locationArea: number;

  @Column({ type: 'int', unique: false, nullable: true })
  hasRent: number;

  @Column({ type: 'varchar', length: 50, unique: false, nullable: true })
  userRentCd: string;

  @Column({ type: 'varchar', length: 2000, unique: false, nullable: true })
  locationDescription: string;

  @Column({ type: 'varchar', length: 2000, unique: false, nullable: true })
  locationNote: string;

  @Column({ type: 'int', unique: false, nullable: false })
  locationStatus: number;

  @Column({ type: 'int', unique: false, nullable: true })
  locationRate: number;

  @OneToMany(() => TbLocationMedia, (media) => media.location)
  media?: TbLocationMedia[];
}
