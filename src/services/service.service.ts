import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateServiceDto,
  CreateServiceResponseDto,
  UpdateServiceDto,
  UpdateServiceResponseDto,
} from '../dtos/service.dto';
import { TbService } from '../entities/service/service.entity';
import { ServiceRepository } from '../repositories/service.repository';
import { ErrorServiceMessage } from '../assests/messages/service.message';

@Injectable()
export class ServiceService {
  constructor(private serviceRepo: ServiceRepository) {}

  public async CreateService(
    payload: CreateServiceDto,
  ): Promise<CreateServiceResponseDto> {
    if (!payload) {
      throw new HttpException(
        ErrorServiceMessage.CATCH_ERROR.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!payload.serviceName || payload.serviceName.trim() === '') {
      throw new HttpException(
        ErrorServiceMessage.SERVICE_NAME_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.serviceName.length > 50) {
      throw new HttpException(
        ErrorServiceMessage.SERVICE_NAME_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      payload.serviceDescription &&
      payload.serviceDescription.length > 2000
    ) {
      throw new HttpException(
        ErrorServiceMessage.SERVICE_DESCRIPTION_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.serviceLogo && payload.serviceLogo.length > 2000) {
      throw new HttpException(
        ErrorServiceMessage.SERVICE_LOGO_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.serviceBackGround && payload.serviceBackGround.length > 2000) {
      throw new HttpException(
        ErrorServiceMessage.SERVICE_BACKGROUND_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.serviceRepo.CreateService(payload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during create service:', error);
      throw new HttpException(
        ErrorServiceMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async UpdateService(
    payload: UpdateServiceDto,
  ): Promise<UpdateServiceResponseDto> {
    if (!payload.id) {
      throw new HttpException(
        ErrorServiceMessage.CATCH_ERROR.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.serviceName && payload.serviceName.length > 50) {
      throw new HttpException(
        ErrorServiceMessage.SERVICE_NAME_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      payload.serviceDescription &&
      payload.serviceDescription.length > 2000
    ) {
      throw new HttpException(
        ErrorServiceMessage.SERVICE_DESCRIPTION_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.serviceLogo && payload.serviceLogo.length > 2000) {
      throw new HttpException(
        ErrorServiceMessage.SERVICE_LOGO_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.serviceBackGround && payload.serviceBackGround.length > 2000) {
      throw new HttpException(
        ErrorServiceMessage.SERVICE_BACKGROUND_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const existService = await this.serviceRepo.GetServiceById(payload.id);

    if (!existService) {
      throw new HttpException(
        ErrorServiceMessage.SERVICE_NOT_EXIST.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return await this.serviceRepo.UpdateService(existService, payload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during update service:', error);
      throw new HttpException(
        ErrorServiceMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async GetAllService(): Promise<TbService[]> {
    try {
      return await this.serviceRepo.GetAllService();
    } catch (error) {
      console.error('Error during get all services:', error);
      throw new HttpException(
        ErrorServiceMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
