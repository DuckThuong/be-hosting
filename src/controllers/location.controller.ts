import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/jwt/jwt.guard';
import { Public } from '../common/jwt/public.decorator';
import {
  AddLocationMediaRequestDto,
  CreateLocationDto,
  DeleteLocationDto,
  DeleteLocationMediaRequestDto,
  DeleteLocationResponseDto,
  FavoriteLocationListResponseDto,
  GetLocationAddressByLocationCodePayloadDto,
  GetLocationByFillterDto,
  GetShareLinkQueryDto,
  GetShareLinkResponseDto,
  LocationListDto,
  LocationMediaListResponseDto,
  LocationMediaResponseDto,
  LocationResponseDto,
  PaginatedLocationListDto,
  ReorderLocationMediaRequestDto,
  ToggleFavoriteRequestDto,
  ToggleFavoriteResponseDto,
  UpdatelocationPayloadDto,
  UpdateLocationLogoRequestDto,
  UpdateLocationLogoResponseDto,
  UpdateLocationMediaRequestDto,
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
import { UserDecoratorDtoResponse } from '../dtos/user/user.dto';
import { TbLocationType } from '../entities/location/locationType.entity';
import { LocationService } from '../services/location.service';
import { User } from '../user.decorator';

@Controller('location')
@UseGuards(JwtAuthGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @ApiOperation({ summary: 'Them moi phan loai dia diem' })
  @Post('create-location-type')
  public async createLocationType(
    @Body() payload: CreateLocationTypePayloadDto,
  ): Promise<CreateLocationTypeResponseDto> {
    return this.locationService.CreateLocationType(payload);
  }

  @ApiOperation({ summary: 'Cap nhat phan loai dia diem' })
  @Put('update-location-type')
  public async updateLocationType(
    @Body() payload: UpdateLocationTypePayloadDto,
  ): Promise<UpdateLocationTypeResponseDto> {
    return this.locationService.UpdateLocationType(payload);
  }

  @ApiOperation({ summary: 'Lay toan bo phan loai dia diem' })
  @Get('get-all-location-type')
  public async getAllLocationType(): Promise<TbLocationType[]> {
    return this.locationService.GetAllLocationType();
  }

  @ApiOperation({ summary: 'Them moi dich vu cho dia diem' })
  @Post('add-new-location-service')
  public async addNewLocationService(
    @Body() payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    return this.locationService.AddNewLocationService(payload);
  }

  @ApiOperation({ summary: 'Tam dung cung cap dich vu' })
  @Put('pause-location-service')
  public async pauseLocationService(
    @Body() payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    return this.locationService.PauseLocationService(payload);
  }

  @ApiOperation({ summary: 'Go bo dich vu khoi dia diem' })
  @Delete('remove-location-service')
  public async removeLocationService(
    @Body() payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    return this.locationService.RemoveLocationService(payload);
  }

  @ApiOperation({ summary: 'Tao moi dia diem cho thue' })
  @Post('create-location')
  public async createLocation(
    @User() user: UserDecoratorDtoResponse,
    @Body() payload: CreateLocationDto,
  ): Promise<LocationResponseDto> {
    return this.locationService.CreateLocation(user, payload);
  }

  @ApiOperation({ summary: 'Cap nhat thong tin dia diem' })
  @Put('update-location')
  public async updateLocation(
    @Body() payload: UpdatelocationPayloadDto,
  ): Promise<LocationResponseDto> {
    return this.locationService.UpdateLocation(payload);
  }

  @ApiOperation({ summary: 'Xoa dia diem' })
  @Delete('delete-location')
  public async deleteLocation(
    @Body() payload: DeleteLocationDto,
  ): Promise<DeleteLocationResponseDto> {
    return this.locationService.DeleteLocation(payload);
  }

  @ApiOperation({ summary: 'Cap nhat trang thai cho thue dia diem' })
  @Put('update-rent-status')
  public async updateRentStatus(
    @Body() payload: UpdateRentStatusDto,
  ): Promise<UpdateRentStatusResponseDto> {
    return this.locationService.UpdateRentStatus(payload);
  }

  @ApiOperation({ summary: 'Xoa dia chi dia diem' })
  @Delete('delete-location-address')
  public async deleteLocationAdress(
    @Body() payload: DeleteLocationAddressesDto,
  ): Promise<DeleteLocationResponseDto> {
    return this.locationService.DeleteLocationAddressByCode(payload);
  }

  @ApiOperation({ summary: 'Lay toan bo dia diem' })
  @Get('get-all-location')
  public async getAllLocation(): Promise<LocationListDto[]> {
    return this.locationService.GetAllLocation();
  }

  @ApiOperation({ summary: 'Lay toan bo dia diem cua owner' })
  @Get('get-all-location-on-owner')
  public async getAllLocationOnOwner(
    @User() user: UserDecoratorDtoResponse,
  ): Promise<LocationListDto[]> {
    return this.locationService.GetAllLocationOnOwner(user);
  }

  @ApiOperation({ summary: 'Lay toan bo dia diem cua renter' })
  @Get('get-all-location-on-renter')
  public async getAllLocationOnRenter(
    @User() user: UserDecoratorDtoResponse,
  ): Promise<LocationListDto[]> {
    return this.locationService.GetAllLocationOnRenter(user);
  }

  @ApiOperation({ summary: 'Lay dia diem theo code' })
  @Get('get-location-by-code')
  public async getLocationByCode(
    @Query() payload: GetLocationAddressByLocationCodePayloadDto,
  ): Promise<LocationListDto> {
    return this.locationService.GetLocationByLocationCode(payload);
  }

  @ApiOperation({ summary: 'Lay dia diem theo dieu kien' })
  @Get('get-location-by-filter')
  public async getLocationByFilter(
    @Query() payload: GetLocationByFillterDto,
  ): Promise<PaginatedLocationListDto> {
    return this.locationService.GetLocationByFilter(payload);
  }

  @ApiOperation({ summary: 'Them hoac bo yeu thich dia diem' })
  @ApiBearerAuth('JWT-auth')
  @Post('toggle-favorite')
  public async toggleFavorite(
    @User() user: UserDecoratorDtoResponse,
    @Body() payload: ToggleFavoriteRequestDto,
  ): Promise<ToggleFavoriteResponseDto> {
    return this.locationService.ToggleFavorite(user, payload);
  }

  @ApiOperation({ summary: 'Lay danh sach dia diem yeu thich cua toi' })
  @ApiBearerAuth('JWT-auth')
  @Get('get-my-favorite-location')
  public async getMyFavoriteLocation(
    @User() user: UserDecoratorDtoResponse,
  ): Promise<FavoriteLocationListResponseDto> {
    return this.locationService.GetMyFavoriteLocation(user);
  }

  @ApiOperation({ summary: 'Cap nhat logo dia diem' })
  @ApiBearerAuth('JWT-auth')
  @Patch('update-logo')
  public async updateLocationLogo(
    @User() user: UserDecoratorDtoResponse,
    @Body() payload: UpdateLocationLogoRequestDto,
  ): Promise<UpdateLocationLogoResponseDto> {
    return this.locationService.UpdateLocationLogo(user, payload);
  }

  @ApiOperation({ summary: 'Them media cho dia diem' })
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['locationCode', 'mediaType', 'file'],
      properties: {
        locationCode: { type: 'string', example: 'UWUi9ZXl' },
        mediaType: { type: 'string', enum: ['IMAGE', 'VIDEO'] },
        displayOrder: { type: 'number', example: 1 },
        isLogo: { type: 'boolean', example: false },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('add-media')
  public async addLocationMedia(
    @User() user: UserDecoratorDtoResponse,
    @Body() payload: AddLocationMediaRequestDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<LocationMediaResponseDto> {
    return this.locationService.AddLocationMedia(user, payload, file);
  }

  @ApiOperation({ summary: 'Cap nhat media cua dia diem' })
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['locationCode', 'mediaCode'],
      properties: {
        locationCode: { type: 'string', example: 'UWUi9ZXl' },
        mediaCode: { type: 'string', example: 'MEDIA_00000001' },
        mediaType: { type: 'string', enum: ['IMAGE', 'VIDEO'] },
        displayOrder: { type: 'number', example: 2 },
        isLogo: { type: 'boolean', example: false },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Put('update-media')
  public async updateLocationMedia(
    @User() user: UserDecoratorDtoResponse,
    @Body() payload: UpdateLocationMediaRequestDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<LocationMediaResponseDto> {
    return this.locationService.UpdateLocationMedia(user, payload, file);
  }

  @ApiOperation({ summary: 'Xoa media cua dia diem' })
  @ApiBearerAuth('JWT-auth')
  @Delete('delete-media')
  public async deleteLocationMedia(
    @User() user: UserDecoratorDtoResponse,
    @Body() payload: DeleteLocationMediaRequestDto,
  ): Promise<LocationMediaResponseDto> {
    return this.locationService.DeleteLocationMedia(user, payload);
  }

  @ApiOperation({ summary: 'Cap nhat thu tu media cua dia diem' })
  @ApiBearerAuth('JWT-auth')
  @Put('reorder-media')
  public async reorderLocationMedia(
    @User() user: UserDecoratorDtoResponse,
    @Body() payload: ReorderLocationMediaRequestDto,
  ): Promise<LocationMediaListResponseDto> {
    return this.locationService.ReorderLocationMedia(user, payload);
  }

  @ApiOperation({ summary: 'Tao link chia se dia diem' })
  @Public()
  @Get('get-share-link')
  public async getShareLink(
    @Query() payload: GetShareLinkQueryDto,
  ): Promise<GetShareLinkResponseDto> {
    return this.locationService.GetShareLink(payload);
  }
}
