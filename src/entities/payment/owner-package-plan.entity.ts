import { Column, Entity } from 'typeorm';
import { RentalClass } from '../../common/rental-classification';
import { BaseEntity } from '../base.entity';

@Entity('tb_owner_package_plan')
export class TbOwnerPackagePlan extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  planCode: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'enum', enum: RentalClass })
  rentalClass: RentalClass;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'int', nullable: true })
  durationDays: number | null;

  @Column({ type: 'int', default: 0 })
  maxActiveListings: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
