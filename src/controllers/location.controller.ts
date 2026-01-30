import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  CreateLocationTypePayloadDto,
  CreateLocationTypeResponseDto,
  UpdateLocationTypePayloadDto,
  UpdateLocationTypeResponseDto,
} from '../dtos/location/locationType.dto';
import { TbLocationType } from '../entities/location/locationType.entity';
import { LocationService } from '../services/location.service';
import { JwtAuthGuard } from '../common/jwt/jwt.guard';
import {
  AddLocationServicePayload,
  LocationServiceResponse,
} from '../dtos/location/locationService.dto';

@Controller('location')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @ApiOperation({ summary: 'Thêm mới phân loại địa điểm' })
  @Post('create-location-type')
  public async createLocationType(
    @Body() payload: CreateLocationTypePayloadDto,
  ): Promise<CreateLocationTypeResponseDto> {
    return this.locationService.CreateLocationType(payload);
  }

  @ApiOperation({ summary: 'Cập nhật phân loại địa điểm' })
  @Put('update-location-type')
  public async updateLocationType(
    @Body() payload: UpdateLocationTypePayloadDto,
  ): Promise<UpdateLocationTypeResponseDto> {
    return this.locationService.UpdateLocationType(payload);
  }

  @ApiOperation({ summary: 'Lấy toàn bộ phân loại địa điểm' })
  @Get('get-all-location-type')
  public async getAllLocationType(): Promise<TbLocationType[]> {
    return this.locationService.GetAllLocationType();
  }

  @ApiOperation({ summary: 'Thêm mới dịch vụ' })
  @Post('add-new-location-service')
  public async addNewLocationService(
    @Body() payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    return this.locationService.AddNewLocationService(payload);
  }

  @ApiOperation({ summary: 'Tạm dừng cung cấp dịch vụ' })
  @Put('pause-location-service')
  public async pauseLocationService(
    @Body() payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    return this.locationService.PauseLocationService(payload);
  }

  @ApiOperation({ summary: 'Gỡ bỏ dịch vụ' })
  @Delete('remove-location-service')
  public async removeLocationService(
    @Body() payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    return this.locationService.RemoveLocationService(payload);
  }
}
