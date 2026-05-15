import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/jwt/jwt.guard';
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
import { BookingService } from '../services/booking.service';
import { User } from '../user.decorator';

@ApiTags('Booking')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({ summary: 'Tạo booking mới' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  public async createBooking(
    @Body() body: CreateBookingRequestDto,
    @User() user: UserDecoratorDtoResponse,
    @Req() request: Request,
  ): Promise<CreateBookingResponseDto> {
    return this.bookingService.createBooking(user, body, request);
  }

  @ApiOperation({ summary: 'Danh sách booking của tôi (khách)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('my')
  public async getMyBookings(
    @Query() query: BookingListQueryDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<PaginatedBookingResponseDto> {
    return this.bookingService.getMyBookings(user, query);
  }

  @ApiOperation({ summary: 'Danh sách booking (chủ phòng)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('owner')
  public async getOwnerBookings(
    @Query() query: BookingListQueryDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<PaginatedBookingResponseDto> {
    return this.bookingService.getOwnerBookings(user, query);
  }

  @ApiOperation({ summary: 'Kiểm tra trạng thái lock của location' })
  @Get('location/:locationCode/status')
  public async getLocationLockStatus(
    @Param('locationCode') locationCode: string,
  ): Promise<LocationLockStatusDto> {
    return this.bookingService.getLocationLockStatus(locationCode);
  }

  @ApiOperation({ summary: 'Chi tiết booking' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get(':bookingCode')
  public async getBookingDetail(
    @Param('bookingCode') bookingCode: string,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<BookingResponseDto> {
    return this.bookingService.getBookingDetail(user, bookingCode);
  }

  @ApiOperation({ summary: 'Hủy booking (tính phí hủy)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':bookingCode/cancel')
  public async cancelBooking(
    @Param('bookingCode') bookingCode: string,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<CancelBookingResponseDto> {
    return this.bookingService.cancelBooking(user, bookingCode);
  }

  @ApiOperation({ summary: 'Đổi lịch booking (tính phí đổi)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':bookingCode/reschedule')
  public async rescheduleBooking(
    @Param('bookingCode') bookingCode: string,
    @Body() body: RescheduleBookingRequestDto,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<RescheduleBookingResponseDto> {
    return this.bookingService.rescheduleBooking(user, bookingCode, body);
  }
}
