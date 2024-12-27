import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './entity/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailOtpModule } from 'src/email-otp/email-otp.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),EmailOtpModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
