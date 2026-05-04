import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TbLocation } from './location.entity';
import { TbUserDefault } from '../user/user_default.entity';

@Entity('tb_location-favorite')
@Index('IDX_location_favorite_location_user', ['locationCode', 'userCode'], {
  unique: true,
})
export class TbLocationFavorite extends BaseEntity {
  @Column({ type: 'varchar', length: 50, nullable: false })
  locationCode: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  userCode: string;

  // ── Relations ──

  @ManyToOne(() => TbLocation, (location) => location.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'locationCode', referencedColumnName: 'locationCode' })
  location?: TbLocation;

  @ManyToOne(() => TbUserDefault)
  @JoinColumn({ name: 'userCode', referencedColumnName: 'userCode' })
  user?: TbUserDefault;
}
