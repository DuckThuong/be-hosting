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
import { UserModule } from './modules/user.module';
import { TbUserProfile } from './entities/user/user_profile.entity';
import { CloudinaryModule } from './modules/cloudinary.module';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQLHOST,
      port: Number(process.env.MYSQLPORT),
      username: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,

      autoLoadEntities: true,
      synchronize: process.env.TYPEORM_SYNC === 'true',
      logging: process.env.TYPEORM_LOGGING === 'true',
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
