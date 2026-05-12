import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TbUserDefault } from '../user/user_default.entity';
import { TbLocationType } from './locationType.entity';
import { TbLocationAddress } from './locationAddress.entity';
import { TbLocationService } from './locationService.entity';
import { TbLocationMedia } from './locationMedia.entity';
import { TbLocationFavorite } from './locationFavorite.entity';

@Entity('tb_location')
export class TbLocation extends BaseEntity {
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
  locationPrice: number;

  @Column({ type: 'varchar', length: 50, unique: false, nullable: true })
  locationPriceUnit: string;

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

  @Column({ type: 'float', unique: false, nullable: true })
  locationRate: number;

  // ── Relations ──

  @ManyToOne(() => TbLocationType, (type) => type.locations)
  @JoinColumn({ name: 'typeCode', referencedColumnName: 'typeCode' })
  type?: TbLocationType;

  @ManyToOne(() => TbUserDefault)
  @JoinColumn({ name: 'ownerCode', referencedColumnName: 'userCode' })
  owner?: TbUserDefault;

  @OneToMany(() => TbLocationAddress, (addr) => addr.location)
  addresses?: TbLocationAddress[];

  @OneToMany(() => TbLocationService, (svc) => svc.location)
  locationServices?: TbLocationService[];

  @OneToMany(() => TbLocationMedia, (media) => media.location)
  media?: TbLocationMedia[];

  @OneToMany(() => TbLocationFavorite, (fav) => fav.location)
  favorites?: TbLocationFavorite[];
}
