import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceController } from '../controllers/service.controller';
import { TbService } from '../entities/service.entity';
import { ServiceService } from '../services/service.service';
import { ServiceRepository } from '../repositories/service.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TbService])],
  providers: [ServiceService, ServiceRepository],
  controllers: [ServiceController],
  exports: [ServiceService],
})
export class ServiceModule {}
