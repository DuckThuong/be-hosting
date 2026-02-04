import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/jwt/jwt.guard';
import {
  CreateLocationDto,
  DeleteLocationDto,
  DeleteLocationResponseDto,
  GetLocationAddressByLocationCodePayloadDto,
  GetLocationByFillterDto,
  LocationListDto,
  LocationResponseDto,
  UpdatelocationPayloadDto,
  UpdateRentStatusDto,
  UpdateRentStatusResponseDto,
} from '../dtos/location/location.dto';
import { DeleteLocationAddressesDto } from '../dtos/location/locationAddress.dto';
import {
  AddLocationServicePayload,
  LocationServiceResponse,
} from '../dtos/location/locationService.dto';
import {
  CreateLocationTypePayloadDto,
  CreateLocationTypeResponseDto,
  UpdateLocationTypePayloadDto,
  UpdateLocationTypeResponseDto,
} from '../dtos/location/locationType.dto';
import { TbLocationType } from '../entities/location/locationType.entity';
import { LocationService } from '../services/location.service';
import { User } from '../user.decorator';

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

  @ApiOperation({ summary: 'Thêm mới dịch vụ cho địa điểm' })
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

  @ApiOperation({ summary: 'Gỡ bỏ dịch vụ khỏi địa điểm' })
  @Delete('remove-location-service')
  public async removeLocationService(
    @Body() payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    return this.locationService.RemoveLocationService(payload);
  }

  @ApiOperation({ summary: 'Tạo mới địa điểm cho thuê' })
  @Post('create-location')
  public async createLocation(
    @User() user,
    @Body() payload: CreateLocationDto,
  ): Promise<LocationResponseDto> {
    return this.locationService.CreateLocation(user, payload);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin địa điểm' })
  @Put('update-location')
  public async updateLocation(
    @Body() payload: UpdatelocationPayloadDto,
  ): Promise<LocationResponseDto> {
    return this.locationService.UpdateLocation(payload);
  }

  @ApiOperation({ summary: 'Xóa địa điểm' })
  @Delete('delete-location')
  public async deleteLocation(
    @Body() payload: DeleteLocationDto,
  ): Promise<DeleteLocationResponseDto> {
    return this.locationService.DeleteLocation(payload);
  }

  @ApiOperation({ summary: 'Cập nhật trạng thái cho thuê địa điểm' })
  @Put('update-rent-status')
  public async updateRentStatus(
    @Body() payload: UpdateRentStatusDto,
  ): Promise<UpdateRentStatusResponseDto> {
    return this.locationService.UpdateRentStatus(payload);
  }

  @ApiOperation({ summary: 'Xóa địa điểm' })
  @Delete('delete-location-address')
  public async deleteLocationAdress(
    @Body() payload: DeleteLocationAddressesDto,
  ): Promise<DeleteLocationResponseDto> {
    return this.locationService.DeleteLocationAddressByCode(payload);
  }

  @ApiOperation({ summary: 'Lấy toàn bộ địa điểm' })
  @Get('get-all-location')
  public async getAllLocation(): Promise<LocationListDto[]> {
    return this.locationService.GetAllLocation();
  }

  @ApiOperation({ summary: 'Lấy địa điểm theo code' })
  @Get('get-location-by-code')
  public async getLocationByCode(
    @Query() payload: GetLocationAddressByLocationCodePayloadDto,
  ): Promise<LocationListDto> {
    return this.locationService.GetLocationByLocationCode(payload);
  }

  @ApiOperation({ summary: 'Lấy địa điểm theo điều kiện' })
  @Get('get-location-by-filter')
  public async getLocationByFilter(
    @Query() payload: GetLocationByFillterDto,
  ): Promise<LocationListDto[]> {
    return this.locationService.GetLocationByFilter(payload);
  }
}
