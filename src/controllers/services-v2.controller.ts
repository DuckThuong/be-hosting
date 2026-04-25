import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ServiceCatalogItemDto } from '../dtos/location/location-v2.dto';
import { ServicePricingType } from '../entities/service/service.entity';
import { LocationReadRepository } from '../repositories/location/location-read.repository';

@ApiTags('services')
@Controller('services')
export class ServicesV2Controller {
  constructor(private readonly locationReadRepository: LocationReadRepository) {}

  @ApiOperation({ summary: 'List service catalog' })
  @Get()
  public async getServices(): Promise<ServiceCatalogItemDto[]> {
    const services = await this.locationReadRepository.getServices();

    return services.map((service) => ({
      serviceCode: service.serviceCode,
      serviceName: service.serviceName,
      serviceDescription: service.serviceDescription ?? undefined,
      serviceLogo: service.serviceLogo ?? undefined,
      serviceBackGround: service.serviceBackGround ?? undefined,
      servicePrice:
        service.servicePrice === null || service.servicePrice === undefined
          ? undefined
          : Number(service.servicePrice),
      serviceDiscount:
        service.serviceDiscount === null || service.serviceDiscount === undefined
          ? undefined
          : Number(service.serviceDiscount),
      pricingType: service.pricingType ?? ServicePricingType.FULL,
      isCustom: Boolean(service.isCustom),
    }));
  }
}
