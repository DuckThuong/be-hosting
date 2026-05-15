import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  BookingListQueryDto,
  BookingResponseDto,
  CancelBookingResponseDto,
  CreateBookingRequestDto,
  CreateBookingResponseDto,
  LocationLockStatusDto,
  PaginatedBookingResponseDto,
  RescheduleBookingRequestDto,
  RescheduleBookingResponseDto,
} from '../dtos/booking/booking.dto';
import { UserDecoratorDtoResponse } from '../dtos/user/user.dto';
import {
  BookingStatus,
  PaymentStatus,
} from '../entities/booking/booking.entity';
import { BookingRepository } from '../repositories/booking.repository';
import { LocationReadRepository } from '../repositories/location/location-read.repository';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly locationReadRepository: LocationReadRepository,
  ) {}

  public async createBooking(
    user: UserDecoratorDtoResponse,
    dto: CreateBookingRequestDto,
    _request: Request,
  ): Promise<CreateBookingResponseDto> {
    const location = await this.locationReadRepository.getLocationRaw(
      dto.locationCode,
    );

    if (!location) {
      throw new NotFoundException('Dia diem khong ton tai.');
    }

    return {
      message:
        'He thong khong ho tro dat coc truc tiep. Vui long lien he chu phong de trao doi va dat phong.',
      locationCode: location.locationCode,
      owner: {
        userCode: location.ownerCode,
        username: location.owner?.username ?? '',
        email: location.owner?.email,
        avatarUrl: location.owner?.profile?.avatarUrl ?? null,
        phone: location.owner?.profile?.phone ?? null,
      },
    };
  }

  public async cancelBooking(
    user: UserDecoratorDtoResponse,
    bookingCode: string,
  ): Promise<CancelBookingResponseDto> {
    const booking = await this.bookingRepository.findByCode(bookingCode);

    if (!booking) {
      throw new NotFoundException('Booking khong ton tai.');
    }

    if (booking.guestUserCode !== user.userCode) {
      throw new ForbiddenException('Ban khong co quyen huy booking nay.');
    }

    if (
      booking.status !== BookingStatus.CONFIRMED &&
      booking.status !== BookingStatus.PENDING_PAYMENT
    ) {
      throw new BadRequestException('Booking nay khong the huy.');
    }

    const location = booking.location;
    const cancellationFeePercent = Number(
      location?.cancellationFeePercent || 0,
    );
    const cancellationFee = Math.round(
      (Number(booking.totalPrice) * cancellationFeePercent) / 100,
    );
    const refundAmount = 0;

    const updatedBooking = await this.bookingRepository.updateBooking(
      bookingCode,
      {
        status: BookingStatus.CANCELLED,
        paymentStatus: PaymentStatus.UNPAID,
        cancellationFee,
        lockedUntil: null,
      },
    );

    await this.bookingRepository.updateLocationRentStatus(
      booking.locationCode,
      0,
      null,
    );

    const responseDto = await this.bookingRepository.mapToResponseDto(
      updatedBooking!,
    );

    const cancellationFeeMessage =
      cancellationFee > 0
        ? ` Phi huy: ${cancellationFee.toLocaleString('vi-VN')}d`
        : '';

    return {
      message: `Booking da duoc huy.${cancellationFeeMessage}`,
      cancellationFee,
      refundAmount,
      booking: responseDto,
    };
  }

  public async rescheduleBooking(
    user: UserDecoratorDtoResponse,
    bookingCode: string,
    dto: RescheduleBookingRequestDto,
  ): Promise<RescheduleBookingResponseDto> {
    const booking = await this.bookingRepository.findByCode(bookingCode);

    if (!booking) {
      throw new NotFoundException('Booking khong ton tai.');
    }

    if (booking.guestUserCode !== user.userCode) {
      throw new ForbiddenException('Ban khong co quyen doi lich booking nay.');
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException(
        'Chi booking da xac nhan moi co the doi lich.',
      );
    }

    if (new Date(dto.checkInDate) >= new Date(dto.checkOutDate)) {
      throw new BadRequestException('Ngay check-in phai truoc ngay check-out.');
    }

    const location = booking.location;
    const rescheduleFeePercent = Number(location?.rescheduleFeePercent || 0);
    const rescheduleFee = Math.round(
      (Number(booking.totalPrice) * rescheduleFeePercent) / 100,
    );

    const updatedBooking = await this.bookingRepository.updateBooking(
      bookingCode,
      {
        checkInDate: dto.checkInDate,
        checkOutDate: dto.checkOutDate,
        rescheduleFee,
      },
    );

    const responseDto = await this.bookingRepository.mapToResponseDto(
      updatedBooking!,
    );

    const rescheduleFeeMessage =
      rescheduleFee > 0
        ? ` Phi doi lich: ${rescheduleFee.toLocaleString('vi-VN')}d`
        : '';

    return {
      message: `Lich da duoc doi.${rescheduleFeeMessage}`,
      rescheduleFee,
      booking: responseDto,
    };
  }

  public async getMyBookings(
    user: UserDecoratorDtoResponse,
    query: BookingListQueryDto,
  ): Promise<PaginatedBookingResponseDto> {
    await this.bookingRepository.cleanupExpiredBookings();

    const { data, total } = await this.bookingRepository.getBookingsByGuest(
      user.userCode,
      query,
    );
    const page = query.page || 1;
    const limit = query.limit || 20;

    const mappedData = await Promise.all(
      data.map((b) => this.bookingRepository.mapToResponseDto(b)),
    );

    return {
      data: mappedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async getOwnerBookings(
    user: UserDecoratorDtoResponse,
    query: BookingListQueryDto,
  ): Promise<PaginatedBookingResponseDto> {
    await this.bookingRepository.cleanupExpiredBookings();

    const { data, total } = await this.bookingRepository.getBookingsByOwner(
      user.userCode,
      query,
    );
    const page = query.page || 1;
    const limit = query.limit || 20;

    const mappedData = await Promise.all(
      data.map((b) => this.bookingRepository.mapToResponseDto(b)),
    );

    return {
      data: mappedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async getBookingDetail(
    user: UserDecoratorDtoResponse,
    bookingCode: string,
  ): Promise<BookingResponseDto> {
    const booking = await this.bookingRepository.findByCode(bookingCode);

    if (!booking) {
      throw new NotFoundException('Booking khong ton tai.');
    }

    if (
      booking.guestUserCode !== user.userCode &&
      booking.ownerUserCode !== user.userCode
    ) {
      throw new ForbiddenException('Ban khong co quyen xem booking nay.');
    }

    return this.bookingRepository.mapToResponseDto(booking);
  }

  public async getLocationLockStatus(
    locationCode: string,
  ): Promise<LocationLockStatusDto> {
    const activeBooking =
      await this.bookingRepository.findActiveBookingForLocation(locationCode);

    if (!activeBooking) {
      return { isLocked: false, lockedUntil: null };
    }

    return {
      isLocked: true,
      lockedUntil: activeBooking.lockedUntil,
    };
  }
}
