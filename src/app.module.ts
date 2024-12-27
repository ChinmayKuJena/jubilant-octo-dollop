import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GroqModule } from './groq/groq.module';
import { AwsModule } from './aws/aws.module';
import { SocketModule } from './socket/socket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroqEntity } from './groq/groq.entity';
import { SocketDataEntity } from './socket/socketdata.entity';
import { UiModule } from './ui/ui.module';
import { EmailOtpModule } from './email-otp/email-otp.module';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/entity/users.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/web.auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Load environment variables globally
    }),
    GroqModule,
    AwsModule,
    SocketModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [GroqEntity,SocketDataEntity,UserEntity],
        synchronize: false,
        logging: true,
        // ssl: {
        //   rejectUnauthorized: true,
        //   ca: (configService.get<string>('DB_SSL_CERT_PATH')).toString(),
        // },
      }),
    }),
    UiModule,
    EmailOtpModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
  {provide:APP_GUARD, useClass: AuthGuard},
    AppService
  ],
})
export class AppModule {}
