import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TbUserDefault } from './entities/user/user_default.entity';
import { AuthModule } from './modules/auth.module';
import { ServiceModule } from './modules/service.module';
import { TbService } from './entities/service/service.entity';
import { LocationModule } from './modules/location.module';
import { TbLocation } from './entities/location/location.entity';
import { TbLocationFavorite } from './entities/location/locationFavorite.entity';
import { TbLocationService } from './entities/location/locationService.entity';
import { TbLocationType } from './entities/location/locationType.entity';
import { UserModule } from './modules/user.module';
import { TbUserProfile } from './entities/user/user_profile.entity';
import { CloudinaryModule } from './modules/cloudinary.module';
import { ChatModule } from './modules/chat.module';
import { CommonModule } from './modules/common.module';
import { TbMessage } from './entities/chat/message.entity';
import { TbConversationParticipant } from './entities/chat/converation_paticipant.entity';
import { TbConversation } from './entities/chat/converation.entity';
import { TbLocationMedia } from './entities/location/locationMedia.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQLHOST'),
        port: Number(configService.get('MYSQLPORT')),
        username: configService.get('MYSQLUSER'),
        password: configService.get('MYSQLPASSWORD'),
        database: configService.get('MYSQLDATABASE'),
        charset: 'utf8mb4',
        autoLoadEntities: true,
        synchronize: configService.get('TYPEORM_SYNC') === 'true',
        logging: configService.get('TYPEORM_LOGGING') === 'true',
        ssl: {
          rejectUnauthorized: false,
        },
        extra: {
          connectTimeout: 60000,
        },
        entities: [
          TbUserDefault,
          TbUserProfile,
          TbService,
          TbLocation,
          TbLocationFavorite,
          TbLocationMedia,
          TbLocationService,
          TbLocationType,
          TbConversation,
          TbConversationParticipant,
          TbMessage,
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
    ChatModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
