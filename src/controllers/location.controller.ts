import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {
  CreateLocationTypePayloadDto,
  CreateLocationTypeResponseDto,
  UpdateLocationTypePayloadDto,
  UpdateLocationTypeResponseDto,
} from '../dtos/location/locationType.dto';
import { TbLocationType } from '../entities/location/locationType.entity';
import { LocationService } from '../services/location.service';
import { JwtAuthGuard } from '../common/jwt/jwt.guard';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @ApiOperation({ summary: 'Thêm mới phân loại địa điểm' })
  @UseGuards(JwtAuthGuard)
  @Post('create-location-type')
  public async createLocationType(
    @Body() payload: CreateLocationTypePayloadDto,
  ): Promise<CreateLocationTypeResponseDto> {
    return this.locationService.CreateLocationType(payload);
  }

  @ApiOperation({ summary: 'Cập nhật phân loại địa điểm' })
  @UseGuards(JwtAuthGuard)
  @Put('update-location-type')
  public async updateLocationType(
    @Body() payload: UpdateLocationTypePayloadDto,
  ): Promise<UpdateLocationTypeResponseDto> {
    return this.locationService.UpdateLocationType(payload);
  }

  @ApiOperation({ summary: 'Lấy toàn bộ phân loại địa điểm' })
  @UseGuards(JwtAuthGuard)
  @Get('get-all-location-type')
  public async getAllLocationType(): Promise<TbLocationType[]> {
    return this.locationService.GetAllLocationType();
  }
}
