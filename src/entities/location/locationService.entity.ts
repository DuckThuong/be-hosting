import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ServicePricingType } from '../service/service.entity';

@Entity('tb_location-service')
export class TbLocationService {
  @PrimaryGeneratedColumn('increment', {
    comment: 'Primary key',
  })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  locationCode: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  serviceCode: string;

  @Column({ type: 'decimal', nullable: true })
  customPrice: number | null;

  @Column({
    type: 'enum',
    enum: ServicePricingType,
    default: ServicePricingType.FULL,
  })
  pricingType: ServicePricingType;
}
