import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuccessServiceMessage } from '@assets/messages/service.message';
import {
  CreateServiceDto,
  CreateServiceResponseDto,
  ServiceDto,
  UpdateServiceDto,
  UpdateServiceResponseDto,
} from '@dtos/service.dto';
import { TbService } from '@entities/service/service.entity';
import { randomString } from '@common/helpers/common.helper';

const DEFAULT_SERVICE_CATEGORY = 'GENERAL';

@Injectable()
export class ServiceRepository {
  constructor(
    @InjectRepository(TbService)
    private readonly service: Repository<TbService>,
  ) {}

  private toDto(service: TbService): ServiceDto {
    return {
      id: service.id,
      code: service.code,
      name: service.name,
      category: service.category,
    };
  }

  public async CreateService(
    payload: CreateServiceDto,
  ): Promise<CreateServiceResponseDto> {
    const code = payload.code?.trim() || randomString();

    // Check duplicate code
    if (payload.code) {
      const existingByCode = await this.service.findOneBy({ code });
      if (existingByCode) {
        throw new Error('SERVICE_CODE_DUPLICATE');
      }
    }

    // Check duplicate name
    const existingByName = await this.service.findOneBy({
      name: payload.name.trim(),
    });
    if (existingByName) {
      throw new Error('SERVICE_NAME_DUPLICATE');
    }

    const service = this.service.create({
      code,
      name: payload.name.trim(),
      category: payload.category?.trim() || DEFAULT_SERVICE_CATEGORY,
    });

    const saved = await this.service.save(service);
    return {
      message: SuccessServiceMessage.CREATE_SUCCESS,
      data: this.toDto(saved),
    };
  }

  public async UpdateService(
    oldData: TbService,
    payload: UpdateServiceDto,
  ): Promise<UpdateServiceResponseDto> {
    const updatedEntity = this.service.merge(oldData, {
      code: payload.code?.trim() ?? oldData.code,
      name: payload.name?.trim() ?? oldData.name,
      category: payload.category?.trim() ?? oldData.category,
    });

    const saved = await this.service.save(updatedEntity);
    return {
      message: SuccessServiceMessage.UPDATE_SUCCESS,
      data: this.toDto(saved),
    };
  }

  public async GetAllService(): Promise<ServiceDto[]> {
    const services = await this.service.find({
      order: { name: 'ASC' },
    });

    return services.map((item) => this.toDto(item));
  }

  public async GetServiceById(id: number): Promise<TbService | null> {
    return await this.service.findOne({
      where: { id },
    });
  }
}
