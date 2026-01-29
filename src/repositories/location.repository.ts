import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import {
  CreateLocationServicePayloadDto,
  CreateLocationServiceResponseDto,
  LocationServiceDto,
} from '../dtos/location/locationService.dto';
import { TbLocation } from '../entities/location/location.entity';
import { TbLocationService } from '../entities/location/locationService.entity';
import { TbLocationType } from '../entities/location/locationType.entity';

@Injectable()
export class LocationRepository {
  constructor(
    @InjectRepository(TbLocation)
    private readonly location: Repository<TbLocation>,

    @InjectRepository(TbLocationService)
    private readonly locationService: Repository<TbLocationService>,

    @InjectRepository(TbLocationType)
    private readonly locationType: Repository<TbLocationType>,
  ) {}

  public async createLocationService(
    data: CreateLocationServicePayloadDto,
  ): Promise<CreateLocationServiceResponseDto> {
    const service = this.locationType.create({
      typeCode: data.code,
      typeName: data.name,
      typeDescription: data.description,
      typeLogo: data.logo,
      typeBackGround: data.backgroundUrl,
    });
    if (service) {
      const savedService = await this.locationType.save(service);
      return {
        message: 'Tạo mới thành công.',
        data: plainToInstance(LocationServiceDto, savedService),
      };
    } else {
      return {
        message: 'Tạo mới thất bại.',
        data: plainToInstance(LocationServiceDto, {}),
      };
    }
  }

  public async getAllLocationType(): Promise<TbLocationType[]> {
    return await this.locationType.find();
  }
}
