import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/jwt/jwt.guard';
import {
  CreateLocationRequestDto,
  LocationMutationResponseDto,
  LocationListQueryDto,
  PaginatedLocationResponseDto,
  RelatedLocationsQueryDto,
  UpdateLocationRequestDto,
  LocationDetailResponseDto,
  LocationSummaryResponseDto,
} from '../dtos/location/location-v2.dto';
import { UserDecoratorDtoResponse } from '../dtos/user/user.dto';
import { LocationQueryService } from '../services/location-query.service';
import { LocationWriteService } from '../services/location-write.service';
import { User } from '../user.decorator';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(
    private readonly locationWriteService: LocationWriteService,
    private readonly locationQueryService: LocationQueryService,
  ) {}

  @ApiOperation({ summary: 'Create a location listing' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  public async createLocation(
    @User() user: UserDecoratorDtoResponse,
    @Body() payload: CreateLocationRequestDto,
  ): Promise<LocationMutationResponseDto> {
    return this.locationWriteService.createLocation(user, payload);
  }

  @ApiOperation({ summary: 'Lấy danh sách địa điểm' })
  @Get()
  public async getLocations(
    @Query() payload: LocationListQueryDto,
  ): Promise<PaginatedLocationResponseDto> {
    return this.locationQueryService.getLocations(payload);
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết của một địa điểm' })
  @Get(':locationCode')
  public async getLocationByCode(
    @Param('locationCode') locationCode: string,
  ): Promise<LocationDetailResponseDto> {
    return this.locationQueryService.getLocationByCode(locationCode);
  }

  @ApiOperation({ summary: 'Lấy danh sách phòng của owner' })
  @Get('owner/:ownerCode')
  public async getLocationsByOwner(
    @Param('ownerCode') ownerCode: string,
  ): Promise<LocationSummaryResponseDto[]> {
    return this.locationQueryService.getLocationsByOwner(ownerCode);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin địa điểm' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':locationCode')
  public async updateLocation(
    @User() user: UserDecoratorDtoResponse,
    @Param('locationCode') locationCode: string,
    @Body() payload: UpdateLocationRequestDto,
  ): Promise<LocationMutationResponseDto> {
    return this.locationWriteService.updateLocation(user, locationCode, payload);
  }

  @ApiOperation({ summary: 'Lấy danh sách địa điểm liên quan' })
  @Get(':locationCode/related')
  public async getRelatedLocations(
    @Param('locationCode') locationCode: string,
    @Query() query: RelatedLocationsQueryDto,
  ): Promise<PaginatedLocationResponseDto> {
    return this.locationQueryService.getRelatedLocations(
      locationCode,
      query.page,
      query.limit,
    );
  }
}
