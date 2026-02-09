import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TbUserDefault } from './entities/user/user_default.entity';
import { AuthModule } from './modules/auth.module';
import { ServiceModule } from './modules/service.module';
import { TbService } from './entities/service.entity';
import { LocationModule } from './modules/location.module';
import { TbLocation } from './entities/location/location.entity';
import { TbLocationService } from './entities/location/locationService.entity';
import { TbLocationType } from './entities/location/locationType.entity';
import { UserModule } from './modules/user.module';
import { TbUserProfile } from './entities/user/user_profile.entity';
import { CloudinaryModule } from './modules/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Đổi từ forRoot() sang forRootAsync()
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // Inject ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQLHOST'),
        port: configService.get<number>('MYSQLPORT'),
        username: configService.get('MYSQLUSER'),
        password: configService.get('MYSQLPASSWORD'),
        database: configService.get('MYSQLDATABASE'),
        autoLoadEntities: true,
        synchronize: configService.get('TYPEORM_SYNC') === 'true',
        logging: configService.get('TYPEORM_LOGGING') === 'true',
        entities: [
          TbUserDefault,
          TbUserProfile,
          TbService,
          TbLocation,
          TbLocationService,
          TbLocationType,
        ],
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        migrationsRun: false,
      }),
    }),

    AuthModule,
    ServiceModule,
    LocationModule,
    UserModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
