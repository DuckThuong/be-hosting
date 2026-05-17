import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';

export enum PaymentPurpose {
  BOOKING_DEPOSIT = 'BOOKING_DEPOSIT',
  OWNER_PACKAGE = 'OWNER_PACKAGE',
}

export enum PaymentTransactionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
}

@Entity('tb_payment_transaction')
export class TbPaymentTransaction extends BaseEntity {
  @Column({ type: 'varchar', length: 40, unique: true })
  transactionCode: string;

  @Column({ type: 'enum', enum: PaymentPurpose })
  purpose: PaymentPurpose;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentTransactionStatus,
    default: PaymentTransactionStatus.PENDING,
  })
  status: PaymentTransactionStatus;

  @Index()
  @Column({ type: 'varchar', length: 25, nullable: true })
  bookingCode: string | null;

  @Index()
  @Column({ type: 'varchar', length: 50, nullable: true })
  ownerUserCode: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  planCode: string | null;

  @Column({ type: 'varchar', length: 40, unique: true })
  vnpayTxnRef: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  vnpayTransactionNo: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bankCode: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  payDate: string | null;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  expiredAt: Date | null;
}
