import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/jwt/jwt.guard';
import {
  BuyOwnerPackageRequestDto,
  OwnerPackagePlanResponseDto,
  OwnerPackageSubscriptionResponseDto,
  PaymentUrlResponseDto,
  SelectOwnerPackageRequestDto,
  SelectOwnerPackageResponseDto,
} from '../dtos/payment/payment.dto';
import { UserDecoratorDtoResponse } from '../dtos/user/user.dto';
import { PaymentService } from '../services/payment.service';
import { User } from '../user.decorator';

@ApiTags('Payment')
@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Danh sach goi dang tin cua chu phong' })
  @Get('owner-packages/plans')
  public async getOwnerPackagePlans(): Promise<OwnerPackagePlanResponseDto[]> {
    return this.paymentService.getOwnerPackagePlans();
  }

  @ApiOperation({ summary: 'Thong tin quota goi dang tin hien tai' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('owner-packages/me')
  public async getMyPackage(
    @User() user: UserDecoratorDtoResponse,
  ): Promise<OwnerPackageSubscriptionResponseDto> {
    return this.paymentService.getMyLongTermSubscription(user);
  }

  @ApiOperation({ summary: 'Mua goi dang tin qua SePay' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('owner-packages/pay')
  public async buyOwnerPackage(
    @User() user: UserDecoratorDtoResponse,
    @Body() dto: BuyOwnerPackageRequestDto,
    @Req() request: Request,
  ): Promise<PaymentUrlResponseDto> {
    return this.paymentService.buyOwnerPackage(user, dto, request);
  }

  @ApiOperation({ summary: 'Chon goi dang tin Free/Indivisual/Basic/Pro' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('owner-packages/select')
  public async selectOwnerPackage(
    @User() user: UserDecoratorDtoResponse,
    @Body() dto: SelectOwnerPackageRequestDto,
    @Req() request: Request,
  ): Promise<SelectOwnerPackageResponseDto> {
    return this.paymentService.selectOwnerPackage(user, dto, request);
  }

  @ApiOperation({ summary: 'Tao/lay lai QR thanh toan SePay' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('payments/:transactionCode/qr')
  public async getPaymentQr(
    @User() user: UserDecoratorDtoResponse,
    @Param('transactionCode') transactionCode: string,
    @Req() request: Request,
  ): Promise<PaymentUrlResponseDto> {
    return this.paymentService.generatePaymentQr(
      user,
      transactionCode,
      request,
    );
  }

  @ApiOperation({ summary: 'SePay webhook callback' })
  @Post('sepay/webhook')
  public async handleSePayWebhook(
    @Body() body: Record<string, unknown>,
    @Req() request: Request,
  ): Promise<{ success: boolean; message: string }> {
    return this.paymentService.handleSePayWebhook(
      body,
      request.headers.authorization,
    );
  }
}
