import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { TbBasicUser } from './entities/user/tb-basic-user.entity';
import { UserModule } from './modules/user.module';
import { TbMainUser } from './entities/user/tb-main-user.entity';
import { TbHostService } from './entities/hosting/hosting_service.entity';
import { TbServiceLabel } from './entities/hosting/service_label.entity';
import { HostingModule } from './modules/hosting.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'hosting_database',
      entities: [TbBasicUser, TbMainUser, TbHostService, TbServiceLabel],
      synchronize: false,
      autoLoadEntities: true,
      logging: false,
    }),
    AuthModule,
    UserModule,
    HostingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
