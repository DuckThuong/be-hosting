import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { RentalClass } from '../../common/rental-classification';
import { BaseEntity } from '../base.entity';
import { TbOwnerPackagePlan } from './owner-package-plan.entity';

export enum OwnerPackageSubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

@Entity('tb_owner_package_subscription')
export class TbOwnerPackageSubscription extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', length: 50 })
  ownerUserCode: string;

  @Column({ type: 'varchar', length: 50 })
  planCode: string;

  @ManyToOne(() => TbOwnerPackagePlan, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'planCode', referencedColumnName: 'planCode' })
  plan?: TbOwnerPackagePlan;

  @Column({ type: 'enum', enum: RentalClass })
  rentalClass: RentalClass;

  @Column({ type: 'timestamp' })
  startsAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  trialReminderSentAt: Date | null;

  @Column({
    type: 'enum',
    enum: OwnerPackageSubscriptionStatus,
    default: OwnerPackageSubscriptionStatus.ACTIVE,
  })
  status: OwnerPackageSubscriptionStatus;
}
