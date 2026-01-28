import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_location-service')
export class TbLocationService {
  @PrimaryGeneratedColumn('increment', {
    comment: 'Primary key',
  })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: false, nullable: false })
  locationCode: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  serviceCode: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isActive: boolean;
}
