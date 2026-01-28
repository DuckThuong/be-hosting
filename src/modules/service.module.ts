import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceController } from '../controllers/service.controller';
import { TbService } from '../entities/service.entity';
import { ServiceService } from '../services/service.service';

@Module({
  imports: [TypeOrmModule.forFeature([TbService])],
  providers: [ServiceService],
  controllers: [ServiceController],
  exports: [ServiceService],
})
export class ServiceModule {}
