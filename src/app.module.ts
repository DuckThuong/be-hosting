import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TbUserDefault } from './entities/user/user_default.dto';
import { AuthModule } from './modules/auth.module';

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
      entities: [TbUserDefault],
      migrations: ['src/migrations/*.ts'],
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
