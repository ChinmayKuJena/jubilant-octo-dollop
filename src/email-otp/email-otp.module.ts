import { Module } from '@nestjs/common';
import { EmailOtpService } from './email-otp.service';
import { EmailOtpController } from './email-otp.controller';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    CacheModule.register({  store: 'memory',
      ttl: 5*60*1000, // TTL in mili sec
    }),
  ],
  exports: [EmailOtpService],
  providers: [EmailOtpService],
  controllers: [EmailOtpController]
})
export class EmailOtpModule {}
