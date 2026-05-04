import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateServiceDto,
  CreateServiceResponseDto,
  UpdateServiceDto,
  UpdateServiceResponseDto,
} from '../dtos/service.dto';
import { ServiceRepository } from '../repositories/service.repository';
import { ErrorServiceMessage } from '../assets/messages/service.message';
import { ServiceDto } from '../dtos/service.dto';

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

    if (!payload.name || payload.name.trim() === '') {
      throw new HttpException(
        ErrorServiceMessage.SERVICE_NAME_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.code && payload.code.length > 50) {
      throw new HttpException(
        ErrorServiceMessage.SERVICE_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.name.length > 100) {
      throw new HttpException(
        ErrorServiceMessage.SERVICE_NAME_INVALID.toString(),
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

    if (payload.code && payload.code.length > 50) {
      throw new HttpException(
        ErrorServiceMessage.SERVICE_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.name && payload.name.length > 100) {
      throw new HttpException(
        ErrorServiceMessage.SERVICE_NAME_INVALID.toString(),
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

  public async GetAllService(): Promise<ServiceDto[]> {
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
