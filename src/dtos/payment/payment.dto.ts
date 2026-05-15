import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { PaymentPurpose } from '../../entities/payment/payment-transaction.entity';

export class PaymentUrlResponseDto {
  @ApiProperty()
  transactionCode: string;

  @ApiProperty({ enum: PaymentPurpose })
  purpose: PaymentPurpose;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paymentUrl: string;

  @ApiPropertyOptional()
  qrContent?: string;

  @ApiPropertyOptional()
  qrMessage?: string;

  @ApiPropertyOptional()
  transferContent?: string;

  @ApiPropertyOptional()
  bankCode?: string;

  @ApiPropertyOptional()
  accountNumber?: string;

  @ApiPropertyOptional()
  accountName?: string;
}

export class OwnerPackagePlanResponseDto {
  @ApiProperty()
  planCode: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  durationDays: number | null;

  @ApiProperty()
  maxActiveListings: number;
}

export class BuyOwnerPackageRequestDto {
  @ApiProperty({ example: 'LONG_BASIC' })
  @IsString()
  @MaxLength(50)
  planCode: string;
}

export class SelectOwnerPackageRequestDto extends BuyOwnerPackageRequestDto {}

export class OwnerPackageSubscriptionResponseDto {
  @ApiProperty()
  planCode: string;

  @ApiProperty()
  rentalClass: string;

  @ApiProperty()
  maxActiveListings: number;

  @ApiProperty()
  activeListings: number;

  @ApiProperty()
  remainingListings: number;

  @ApiPropertyOptional()
  expiresAt: Date | null;
}

export class SelectOwnerPackageResponseDto {
  @ApiProperty()
  planCode: string;

  @ApiProperty()
  paymentRequired: boolean;

  @ApiPropertyOptional({ type: () => OwnerPackageSubscriptionResponseDto })
  subscription?: OwnerPackageSubscriptionResponseDto;

  @ApiPropertyOptional({ type: () => PaymentUrlResponseDto })
  payment?: PaymentUrlResponseDto;
}
