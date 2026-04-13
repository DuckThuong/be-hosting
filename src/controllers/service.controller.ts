import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/jwt/jwt.guard';
import {
  CreateServiceDto,
  CreateServiceResponseDto,
  UpdateServiceDto,
  UpdateServiceResponseDto,
} from '../dtos/service.dto';
import { TbService } from '../entities/service/service.entity';
import { ServiceService } from '../services/service.service';

@Controller('service')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ServiceController {
  constructor(private readonly serviceSV: ServiceService) {}

  @ApiOperation({ summary: 'Thêm mới dịch vụ' })
  @Post('create-location-service')
  public async createService(
    @Body() payload: CreateServiceDto,
  ): Promise<CreateServiceResponseDto> {
    return this.serviceSV.CreateService(payload);
  }

  @ApiOperation({ summary: 'Cập nhật dịch vụ' })
  @Put('update-location-service')
  public async updateService(
    @Body() payload: UpdateServiceDto,
  ): Promise<UpdateServiceResponseDto> {
    return this.serviceSV.UpdateService(payload);
  }

  @ApiOperation({ summary: 'Lấy toàn bộ dịch vụ' })
  @Get('get-all-location-service')
  public async getAllService(): Promise<TbService[]> {
    return this.serviceSV.GetAllService();
  }
}
