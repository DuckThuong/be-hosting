import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, LessThan, MoreThan, Repository } from 'typeorm';
import {
  BookingStatus,
  PaymentStatus,
  TbBooking,
} from '../entities/booking/booking.entity';
import { TbLocation } from '../entities/location/location.entity';
import { BookingListQueryDto, BookingResponseDto } from '../dtos/booking/booking.dto';

@Injectable()
export class BookingRepository {
  constructor(
    @InjectRepository(TbBooking)
    private readonly bookingRepo: Repository<TbBooking>,
    @InjectRepository(TbLocation)
    private readonly locationRepo: Repository<TbLocation>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  private generateBookingCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'BK-';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Create a booking with pessimistic lock on the location to prevent
   * concurrent double-booking. Uses SELECT ... FOR UPDATE.
   */
  public async createBookingWithLock(data: {
    locationCode: string;
    guestUserCode: string;
    ownerUserCode: string;
    checkInDate?: string;
    checkOutDate?: string;
    totalPrice: number;
    note?: string;
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    lockedUntil?: Date | null;
    setLocationAsRented?: boolean;
  }): Promise<TbBooking> {
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        // Pessimistic lock on the location row
        const location = await transactionalEntityManager.findOne(TbLocation, {
          where: { locationCode: data.locationCode },
          lock: { mode: 'pessimistic_write' },
        });

        if (!location) {
          throw new Error('Location not found');
        }

        if (location.hasRent === 1) {
          throw new Error('Location is already rented');
        }

        // Check for existing active booking (PENDING_PAYMENT with valid lock)
        const existingBooking = await transactionalEntityManager.findOne(
          TbBooking,
          {
            where: {
              locationCode: data.locationCode,
              status: BookingStatus.PENDING_PAYMENT,
              lockedUntil: MoreThan(new Date()),
            },
          },
        );

        if (existingBooking) {
          throw new Error('LOCATION_LOCKED');
        }

        // Also check for CONFIRMED booking
        const confirmedBooking = await transactionalEntityManager.findOne(
          TbBooking,
          {
            where: {
              locationCode: data.locationCode,
              status: BookingStatus.CONFIRMED,
            },
          },
        );

        if (confirmedBooking) {
          throw new Error('Location already has an active booking');
        }

        const bookingCode = this.generateBookingCode();
        const status = data.status || BookingStatus.PENDING_PAYMENT;
        const paymentStatus = data.paymentStatus || PaymentStatus.UNPAID;
        const hasLockedUntil = Object.hasOwn(data, 'lockedUntil');
        const lockedUntil = hasLockedUntil
          ? data.lockedUntil ?? null
          : new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        const booking = transactionalEntityManager.create(TbBooking, {
          bookingCode,
          locationCode: data.locationCode,
          guestUserCode: data.guestUserCode,
          ownerUserCode: data.ownerUserCode,
          checkInDate: data.checkInDate || null,
          checkOutDate: data.checkOutDate || null,
          totalPrice: data.totalPrice,
          status,
          paymentStatus,
          note: data.note || null,
          lockedUntil,
        });

        const savedBooking = await transactionalEntityManager.save(booking);

        if (data.setLocationAsRented) {
          await transactionalEntityManager.update(
            TbLocation,
            { locationCode: data.locationCode },
            { hasRent: 1, userRentCd: data.guestUserCode },
          );
        }

        return savedBooking;
      },
    );
  }

  public async findByCode(bookingCode: string): Promise<TbBooking | null> {
    return this.bookingRepo.findOne({
      where: { bookingCode },
      relations: ['location', 'guest'],
    });
  }

  public async findActiveBookingForLocation(
    locationCode: string,
  ): Promise<TbBooking | null> {
    // Check for PENDING with valid lock or CONFIRMED booking
    const pendingBooking = await this.bookingRepo.findOne({
      where: {
        locationCode,
        status: BookingStatus.PENDING_PAYMENT,
        lockedUntil: MoreThan(new Date()),
      },
    });

    if (pendingBooking) return pendingBooking;

    return this.bookingRepo.findOne({
      where: {
        locationCode,
        status: BookingStatus.CONFIRMED,
      },
    });
  }

  public async updateBooking(
    bookingCode: string,
    data: Partial<TbBooking>,
  ): Promise<TbBooking | null> {
    await this.bookingRepo.update({ bookingCode }, data);
    return this.findByCode(bookingCode);
  }

  public async updateLocationRentStatus(
    locationCode: string,
    hasRent: number,
    userRentCd: string | null,
  ): Promise<void> {
    await this.locationRepo.update(
      { locationCode },
      { hasRent, userRentCd: userRentCd },
    );
  }

  public async getBookingsByGuest(
    guestUserCode: string,
    query: BookingListQueryDto,
  ): Promise<{ data: TbBooking[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 20;

    const where: any = { guestUserCode };
    if (query.status) {
      where.status = query.status;
    }

    const [data, total] = await this.bookingRepo.findAndCount({
      where,
      relations: ['location', 'location.type', 'location.addresses', 'location.media'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  public async getBookingsByOwner(
    ownerUserCode: string,
    query: BookingListQueryDto,
  ): Promise<{ data: TbBooking[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 20;

    const where: any = { ownerUserCode };
    if (query.status) {
      where.status = query.status;
    }

    const [data, total] = await this.bookingRepo.findAndCount({
      where,
      relations: ['location', 'location.type', 'location.addresses', 'location.media', 'guest'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  public async cleanupExpiredBookings(): Promise<number> {
    const expiredBookings = await this.bookingRepo.find({
      where: {
        status: BookingStatus.PENDING_PAYMENT,
        lockedUntil: LessThan(new Date()),
      },
    });

    for (const booking of expiredBookings) {
      booking.status = BookingStatus.CANCELLED;
      booking.lockedUntil = null;
      await this.bookingRepo.save(booking);
    }

    return expiredBookings.length;
  }

  public async mapToResponseDto(booking: TbBooking): Promise<BookingResponseDto> {
    const location = booking.location;
    const primaryAddress = location?.addresses?.[0];
    const logo = location?.media?.find((m) => m.isLogo)?.mediaUrl || location?.locationLogo;

    // Load guest info if not loaded
    let guestInfo = booking.guest;
    if (!guestInfo) {
      const fullBooking = await this.findByCode(booking.bookingCode);
      guestInfo = fullBooking?.guest;
    }

    return {
      bookingCode: booking.bookingCode,
      location: {
        locationCode: booking.locationCode,
        name: location?.locationName || '',
        logo: logo || '',
        typeCode: location?.typeCode,
        typeName: location?.type?.typeName,
        fullAddress: primaryAddress?.fullAddress,
        price: Number(location?.locationPrice || 0),
        priceUnit: location?.locationPriceUnit,
        cancellationFeePercent: Number(location?.cancellationFeePercent || 0),
        rescheduleFeePercent: Number(location?.rescheduleFeePercent || 0),
      },
      guest: {
        userCode: booking.guestUserCode,
        username: guestInfo?.username || '',
        email: guestInfo?.email,
        avatarUrl: null,
        phone: null,
      },
      owner: {
        userCode: booking.ownerUserCode,
        username: '',
        email: undefined,
        avatarUrl: null,
        phone: null,
      },
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      totalPrice: Number(booking.totalPrice),
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      cancellationFee: booking.cancellationFee ? Number(booking.cancellationFee) : null,
      rescheduleFee: booking.rescheduleFee ? Number(booking.rescheduleFee) : null,
      note: booking.note,
      createdAt: booking.createdAt,
    };
  }
}
