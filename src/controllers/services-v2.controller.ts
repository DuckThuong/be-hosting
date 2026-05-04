import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ServiceDto } from '../dtos/service.dto';
import { LocationReadRepository } from '../repositories/location/location-read.repository';

@ApiTags('services')
@Controller('services')
export class ServicesV2Controller {
  constructor(private readonly locationReadRepository: LocationReadRepository) {}

  @ApiOperation({ summary: 'Lấy danh sách dịch vụ' })
  @Get()
  public async getServices(): Promise<ServiceDto[]> {
    const services = await this.locationReadRepository.getServices();

    return services.map((service) => ({
      id: service.id,
      code: service.code,
      name: service.name,
      category: service.category,
    }));
  }
}
