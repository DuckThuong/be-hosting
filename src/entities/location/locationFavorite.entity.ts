import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_location-favorite')
@Index('IDX_location_favorite_location_user', ['locationCode', 'userCode'], {
  unique: true,
})
export class TbLocationFavorite {
  @PrimaryGeneratedColumn('increment', {
    comment: 'Primary key',
  })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  locationCode: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  userCode: string;
}
