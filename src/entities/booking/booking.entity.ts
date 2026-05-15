import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TbLocation } from '../location/location.entity';
import { TbUserDefault } from '../user/user_default.entity';

export enum BookingStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  PARTIAL_REFUND = 'PARTIAL_REFUND',
}

@Entity('tb_booking')
export class TbBooking extends BaseEntity {
  @Column({ type: 'varchar', length: 25, unique: true })
  bookingCode: string;

  @Column({ type: 'varchar', length: 25 })
  locationCode: string;

  @Column({ type: 'varchar', length: 50 })
  guestUserCode: string;

  @Column({ type: 'varchar', length: 50 })
  ownerUserCode: string;

  @Column({ type: 'date', nullable: true })
  checkInDate: string | null;

  @Column({ type: 'date', nullable: true })
  checkOutDate: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING_PAYMENT,
  })
  status: BookingStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  cancellationFee: number | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  rescheduleFee: number | null;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  note: string | null;

  @Column({ type: 'timestamp', nullable: true })
  lockedUntil: Date | null;

  // ── Relations ──

  @ManyToOne(() => TbLocation)
  @JoinColumn({ name: 'locationCode', referencedColumnName: 'locationCode' })
  location?: TbLocation;

  @ManyToOne(() => TbUserDefault)
  @JoinColumn({ name: 'guestUserCode', referencedColumnName: 'userCode' })
  guest?: TbUserDefault;
}
