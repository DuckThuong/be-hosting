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
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/jwt/jwt.guard';
import {
  CreateLocationDto,
  DeleteLocationDto,
  DeleteLocationResponseDto,
  GetLocationAddressByLocationCodePayloadDto,
  GetLocationByFillterDto,
  GetRelatedLocationQueryDto,
  LocationListDto,
  LocationResponseDto,
  PaginatedLocationListDto,
  UpdatelocationPayloadDto,
  UpdateRentStatusDto,
  UpdateRentStatusResponseDto,
  FavoriteLocationListResponseDto,
  ToggleFavoriteRequestDto,
  ToggleFavoriteResponseDto,
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
import { UserDecoratorDtoResponse } from '../dtos/user/user.dto';
import {
  GetAllCommentDto,
  GetAllCommentResponseDto,
  LocationCommentPayloadDto,
} from '../dtos/location/locationComment.dto';

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
  @Get('get-all-location-type')
  public async getAllLocationType(): Promise<TbLocationType[]> {
    return this.locationService.GetAllLocationType();
  }

  @ApiOperation({ summary: 'Thêm mới dịch vụ cho địa điểm' })
  @UseGuards(JwtAuthGuard)
  @Post('add-new-location-service')
  public async addNewLocationService(
    @Body() payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    return this.locationService.AddNewLocationService(payload);
  }

  @ApiOperation({ summary: 'Tạm dừng cung cấp dịch vụ' })
  @UseGuards(JwtAuthGuard)
  @Put('pause-location-service')
  public async pauseLocationService(
    @Body() payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    return this.locationService.PauseLocationService(payload);
  }

  @ApiOperation({ summary: 'Gỡ bỏ dịch vụ khỏi địa điểm' })
  @UseGuards(JwtAuthGuard)
  @Delete('remove-location-service')
  public async removeLocationService(
    @Body() payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    return this.locationService.RemoveLocationService(payload);
  }

  @ApiOperation({ summary: 'Tạo mới địa điểm cho thuê' })
  @UseGuards(JwtAuthGuard)
  @Post('create-location')
  public async createLocation(
    @User() user: UserDecoratorDtoResponse,
    @Body() payload: CreateLocationDto,
  ): Promise<LocationResponseDto> {
    return this.locationService.CreateLocation(user, payload);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin địa điểm' })
  @UseGuards(JwtAuthGuard)
  @Put('update-location')
  public async updateLocation(
    @Body() payload: UpdatelocationPayloadDto,
  ): Promise<LocationResponseDto> {
    return this.locationService.UpdateLocation(payload);
  }

  @ApiOperation({ summary: 'Xóa địa điểm' })
  @UseGuards(JwtAuthGuard)
  @Delete('delete-location')
  public async deleteLocation(
    @Body() payload: DeleteLocationDto,
  ): Promise<DeleteLocationResponseDto> {
    return this.locationService.DeleteLocation(payload);
  }

  @ApiOperation({ summary: 'Cập nhật trạng thái cho thuê địa điểm' })
  @UseGuards(JwtAuthGuard)
  @Put('update-rent-status')
  public async updateRentStatus(
    @Body() payload: UpdateRentStatusDto,
  ): Promise<UpdateRentStatusResponseDto> {
    return this.locationService.UpdateRentStatus(payload);
  }

  @ApiOperation({ summary: 'Xóa địa chỉ địa điểm' })
  @UseGuards(JwtAuthGuard)
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

  @ApiOperation({ summary: 'Lấy toàn bộ địa điểm của owner' })
  @UseGuards(JwtAuthGuard)
  @Get('get-all-location-on-owner')
  public async getAllLocationOnOwner(
    @User() user: UserDecoratorDtoResponse,
  ): Promise<LocationListDto[]> {
    return this.locationService.GetAllLocationOnOwner(user);
  }

  @ApiOperation({ summary: 'Lấy toàn bộ địa điểm' })
  @UseGuards(JwtAuthGuard)
  @Get('get-all-location-renter')
  public async getAllLocationOnRenter(
    @User() user: UserDecoratorDtoResponse,
  ): Promise<LocationListDto[]> {
    return this.locationService.GetAllLocationOnRenter(user);
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
    @User() user: UserDecoratorDtoResponse | undefined,
    @Query() payload: GetLocationByFillterDto,
  ): Promise<PaginatedLocationListDto> {
    return this.locationService.GetLocationByFilter(user, payload);
  }

  @ApiOperation({ summary: 'Lấy danh sách địa điểm liên quan' })
  @Get('get-related-location')
  public async getRelatedLocation(
    @Query() payload: GetRelatedLocationQueryDto,
  ): Promise<PaginatedLocationListDto> {
    return this.locationService.GetRelatedLocation(payload);
  }

  @ApiOperation({ summary: 'Lấy comment' })
  @Get('get-comment')
  public async getComment(
    @Query() payload: GetAllCommentDto,
  ): Promise<GetAllCommentResponseDto> {
    return this.locationService.getComment(payload);
  }

  @ApiOperation({ summary: 'Tạo comment' })
  @Post('create-comment')
  @UseGuards(JwtAuthGuard)
  public async createNewComment(
    @User() user: UserDecoratorDtoResponse,
    @Body() payload: LocationCommentPayloadDto,
  ): Promise<any> {
    return this.locationService.createNewComment(user, payload);
  }

  @ApiOperation({ summary: 'Thêm/Xóa địa điểm yêu thích' })
  @UseGuards(JwtAuthGuard)
  @Post('toggle-favorite')
  public async toggleFavorite(
    @User() user: UserDecoratorDtoResponse,
    @Body() payload: ToggleFavoriteRequestDto,
  ): Promise<ToggleFavoriteResponseDto> {
    return this.locationService.ToggleFavorite(user, payload);
  }

  @ApiOperation({ summary: 'Lấy danh sách địa điểm yêu thích' })
  @UseGuards(JwtAuthGuard)
  @Get('get-my-favorite')
  public async getMyFavoriteLocation(
    @User() user: UserDecoratorDtoResponse,
  ): Promise<FavoriteLocationListResponseDto> {
    return this.locationService.GetMyFavoriteLocation(user);
  }
}

