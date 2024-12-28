import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import * as Redis from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const redisClient = new Redis.Redis({
          port: 17900, // Redis Cloud port
          host: process.env['REDIS_HOST'], // Redis Cloud host
          password: process.env['REDIS_PASSWORD'], // Redis Cloud password
          db: 0, // Default database index
        });
        return redisClient;
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
  controllers: [RedisController],
})
export class RedisModule {}
