import { Module } from '@nestjs/common';
import { CommonController } from '../controllers/common.controller';
import { CommonService } from '../services/common.service';
import { LocationModule } from './location.module';
import { ServiceModule } from './service.module';

@Module({
  imports: [LocationModule, ServiceModule],
  providers: [CommonService],
  controllers: [CommonController],
})
export class CommonModule {}
