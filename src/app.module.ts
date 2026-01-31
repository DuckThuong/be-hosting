import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TbUserDefault } from './entities/user/user_default.entity';
import { AuthModule } from './modules/auth.module';
import { ServiceModule } from './modules/service.module';
import { TbService } from './entities/service.entity';
import { LocationModule } from './modules/location.module';
import { TbLocation } from './entities/location/location.entity';
import { TbLocationService } from './entities/location/locationService.entity';
import { TbLocationType } from './entities/location/locationType.entity';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      autoLoadEntities: true,
      synchronize: process.env.TYPEORM_SYNC === 'true',
      logging: process.env.TYPEORM_LOGGING === 'true',
      entities: [
        TbUserDefault,
        TbService,
        TbLocation,
        TbLocationService,
        TbLocationType,
      ],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsRun: false,
    }),
    AuthModule,
    ServiceModule,
    LocationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
