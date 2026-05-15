import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { BookingStatus, PaymentStatus } from '../../entities/booking/booking.entity';

export class CreateBookingRequestDto {
  @ApiProperty({ example: 'LOC001', description: 'Mã địa điểm cần đặt' })
  @IsString()
  @MaxLength(25)
  locationCode: string;

  @ApiPropertyOptional({ example: '2026-06-01' })
  @IsOptional()
  @IsDateString()
  checkInDate?: string;

  @ApiPropertyOptional({ example: '2026-06-30' })
  @IsOptional()
  @IsDateString()
  checkOutDate?: string;

  @ApiPropertyOptional({ example: 'Cần phòng yên tĩnh' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}

export class RescheduleBookingRequestDto {
  @ApiProperty({ example: '2026-07-01' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ example: '2026-07-31' })
  @IsDateString()
  checkOutDate: string;
}

export class BookingListQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ enum: BookingStatus })
  @IsOptional()
  @IsString()
  status?: BookingStatus;
}

// ── Response DTOs ──

export class BookingLocationSummaryDto {
  @ApiProperty()
  locationCode: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  logo?: string;

  @ApiPropertyOptional()
  typeCode?: string;

  @ApiPropertyOptional()
  typeName?: string;

  @ApiPropertyOptional()
  fullAddress?: string;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  priceUnit?: string;

  @ApiPropertyOptional()
  cancellationFeePercent?: number;

  @ApiPropertyOptional()
  rescheduleFeePercent?: number;
}

export class BookingUserSummaryDto {
  @ApiProperty()
  userCode: string;

  @ApiProperty()
  username: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  avatarUrl?: string | null;

  @ApiPropertyOptional()
  phone?: string | null;
}

export class BookingResponseDto {
  @ApiProperty()
  bookingCode: string;

  @ApiProperty({ type: () => BookingLocationSummaryDto })
  location: BookingLocationSummaryDto;

  @ApiProperty({ type: () => BookingUserSummaryDto })
  guest: BookingUserSummaryDto;

  @ApiProperty({ type: () => BookingUserSummaryDto })
  owner: BookingUserSummaryDto;

  @ApiPropertyOptional()
  checkInDate: string | null;

  @ApiPropertyOptional()
  checkOutDate: string | null;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty({ enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @ApiPropertyOptional()
  cancellationFee: number | null;

  @ApiPropertyOptional()
  rescheduleFee: number | null;

  @ApiPropertyOptional()
  note: string | null;

  @ApiProperty()
  createdAt: Date;
}

export class CreateBookingResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  locationCode: string;

  @ApiProperty({ type: () => BookingUserSummaryDto })
  owner: BookingUserSummaryDto;

  @ApiPropertyOptional()
  bookingCode?: string;

  @ApiPropertyOptional()
  paymentUrl?: string;

  @ApiPropertyOptional()
  transactionCode?: string;

  @ApiPropertyOptional()
  depositAmount?: number;

  @ApiPropertyOptional()
  qrContent?: string;

  @ApiPropertyOptional()
  qrMessage?: string;
}

export class PaginatedBookingResponseDto {
  @ApiProperty({ type: [BookingResponseDto] })
  data: BookingResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

export class LocationLockStatusDto {
  @ApiProperty()
  isLocked: boolean;

  @ApiPropertyOptional()
  lockedUntil?: Date | null;
}

export class CancelBookingResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  cancellationFee: number;

  @ApiProperty()
  refundAmount: number;

  @ApiProperty({ type: () => BookingResponseDto })
  booking: BookingResponseDto;
}

export class RescheduleBookingResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  rescheduleFee: number;

  @ApiProperty({ type: () => BookingResponseDto })
  booking: BookingResponseDto;
}
