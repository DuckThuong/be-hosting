import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateServiceDto,
  CreateServiceResponseDto,
  UpdateServiceDto,
  UpdateServiceResponseDto,
} from '../dtos/service.dto';
import { TbService } from '../entities/service.entity';
import { ServiceRepository } from '../repositories/service.repository';
import { ErrorServiceMessage } from '../assests/messages/service.message';

@Injectable()
export class ServiceService {
  constructor(private serviceRepo: ServiceRepository) {}

  public async CreateService(
    payload: CreateServiceDto,
  ): Promise<CreateServiceResponseDto> {
    try {
      if (!payload) {
        throw new HttpException(
          ErrorServiceMessage.CATCH_ERROR.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payload.serviceCode === '') {
        throw new HttpException(
          ErrorServiceMessage.SERVICE_CODE_NOTEMPTY.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payload.serviceCode.length > 50) {
        throw new HttpException(
          ErrorServiceMessage.SERVICE_CODE_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payload.serviceName === '') {
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

      if (payload.serviceDescription.length > 2000) {
        throw new HttpException(
          ErrorServiceMessage.SERVICE_DESCRIPTION_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payload.serviceLogo.length > 2000) {
        throw new HttpException(
          ErrorServiceMessage.SERVICE_LOGO_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payload.serviceBackGround.length > 2000) {
        throw new HttpException(
          ErrorServiceMessage.SERVICE_BACKGROUND_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.serviceRepo.CreateService(payload);
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw new HttpException(
        ErrorServiceMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async UpdateService(
    payload: UpdateServiceDto,
  ): Promise<UpdateServiceResponseDto> {
    try {
      if (!payload.id) {
        throw new HttpException(
          ErrorServiceMessage.CATCH_ERROR.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (payload.serviceName.length > 50) {
        throw new HttpException(
          ErrorServiceMessage.SERVICE_NAME_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payload.serviceDescription.length > 2000) {
        throw new HttpException(
          ErrorServiceMessage.SERVICE_DESCRIPTION_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payload.serviceLogo.length > 2000) {
        throw new HttpException(
          ErrorServiceMessage.SERVICE_LOGO_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payload.serviceBackGround.length > 2000) {
        throw new HttpException(
          ErrorServiceMessage.SERVICE_BACKGROUND_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      const existSERVICE = await this.serviceRepo.GetServiceById(payload.id);

      if (!existSERVICE) {
        throw new HttpException(
          ErrorServiceMessage.SERVICE_NOT_EXIST.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        return this.serviceRepo.UpdateService(existSERVICE, payload);
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw new HttpException(
        ErrorServiceMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async GetAllService(): Promise<TbService[]> {
    return await this.serviceRepo.GetAllService();
  }
}
