import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/jwt/jwt.guard';
import {
  CreateServiceDto,
  CreateServiceResponseDto,
  UpdateServiceDto,
  UpdateServiceResponseDto,
} from '../dtos/service.dto';
import { TbService } from '../entities/service.entity';
import { ServiceService } from '../services/service.service';

@Controller('service')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ServiceController {
  constructor(private readonly serviceSV: ServiceService) {}

  @ApiOperation({ summary: 'Thêm mới phân loại địa điểm' })
  @Post('create-location-type')
  public async createService(
    @Body() payload: CreateServiceDto,
  ): Promise<CreateServiceResponseDto> {
    return this.serviceSV.CreateService(payload);
  }

  @ApiOperation({ summary: 'Cập nhật phân loại địa điểm' })
  @Put('update-location-type')
  public async updateService(
    @Body() payload: UpdateServiceDto,
  ): Promise<UpdateServiceResponseDto> {
    return this.serviceSV.UpdateService(payload);
  }

  @ApiOperation({ summary: 'Lấy toàn bộ phân loại địa điểm' })
  @Get('get-all-location-type')
  public async getAllService(): Promise<TbService[]> {
    return this.serviceSV.GetAllService();
  }
}
