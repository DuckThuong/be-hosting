import { Entity, PrimaryColumn } from 'typeorm';

@Entity('tb_location-service')
export class TbLocationService {
  @PrimaryColumn({ type: 'varchar', length: 50, unique: false, nullable: false })
  locationCode: string;

  @PrimaryColumn({ type: 'varchar', length: 50, unique: false, nullable: false })
  serviceCode: string;
}
