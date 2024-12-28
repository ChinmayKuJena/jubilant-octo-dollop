import { Controller, Get, Query } from '@nestjs/common';
import { RedisService } from './redis.service';
import { AllowAnonymous } from 'src/auth/allowAll.metas';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}
  @Get('keys')
  @AllowAnonymous()
  async getKeys(@Query('pattern') pattern: string): Promise<string[]> {
    return this.redisService.getAllKeys(pattern);
  }
  @Get('set')
  async setTestData() {
    await this.redisService.set('testKey', 'Hello from Redis');
    return 'Data saved to Redis';
  }

  @Get('get')
  async getTestData() {
    const value = await this.redisService.get('testKey');
    return `Data from Redis: ${value}`;
  }
}
