import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { SuccessServiceMessage } from '../assests/messages/service.message';
import {
  CreateServiceDto,
  CreateServiceResponseDto,
  ServiceDto,
  UpdateServiceDto,
  UpdateServiceResponseDto,
} from '../dtos/service.dto';
import { TbService } from '../entities/service/service.entity';
import { ServicePricingType } from '../entities/service/service.entity';
import { randomString } from '../common/helpers/common.helper';

@Injectable()
export class ServiceRepository {
  constructor(
    @InjectRepository(TbService)
    private readonly service: Repository<TbService>,
  ) {}

  public async CreateService(
    payload: CreateServiceDto,
  ): Promise<CreateServiceResponseDto> {
    const service = this.service.create({
      serviceCode: randomString(),
      serviceName: payload.serviceName,
      serviceDescription: payload.serviceDescription,
      serviceLogo: payload.serviceLogo,
      serviceBackGround: payload.serviceBackGround,
      servicePrice: 0,
      serviceDiscount: 0,
      pricingType: ServicePricingType.FULL,
      isCustom: 0,
      createdByUserCode: null,
    });

    const saveType = await this.service.save(service);
    return {
      message: SuccessServiceMessage.CREATE_SUCCESS,
      data: plainToInstance(ServiceDto, saveType),
    };
  }

  public async UpdateService(
    oldData: TbService,
    payload: UpdateServiceDto,
  ): Promise<UpdateServiceResponseDto> {
    const updatedEntity = this.service.merge(oldData, {
      serviceCode: oldData.serviceCode,
      serviceName: payload.serviceName ?? oldData.serviceName,
      serviceDescription:
        payload.serviceDescription ?? oldData.serviceDescription,
      serviceLogo: payload.serviceLogo ?? oldData.serviceLogo,
      serviceBackGround: payload.serviceBackGround ?? oldData.serviceBackGround,
      servicePrice: 0,
      serviceDiscount: 0,
      pricingType: ServicePricingType.FULL,
    });

    const savedType = await this.service.save(updatedEntity);
    return {
      message: SuccessServiceMessage.UPDATE_SUCCESS,
      data: plainToInstance(ServiceDto, savedType),
    };
  }

  public async GetAllService(): Promise<ServiceDto[]> {
    return await this.service.find({
      where: {
        isCustom: 0,
        servicePrice: 0 as any,
      },
      order: {
        serviceName: 'ASC',
      },
    });
  }

  public async GetServiceById(id: number): Promise<ServiceDto | null> {
    return await this.service.findOne({
      where: { id },
    });
  }
}
