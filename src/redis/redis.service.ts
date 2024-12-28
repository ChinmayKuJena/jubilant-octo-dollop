import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async getAllKeys(pattern: string = '*'): Promise<string[]> {
    return await this.redisClient.keys(pattern);
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async get(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }

  async publish(channel: string, message: string): Promise<void> {
    await this.redisClient.publish(channel, message);
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    const subscriber = this.redisClient.duplicate();
    await subscriber.subscribe(channel);
    subscriber.on('message', (channel, message) => {
      callback(message);
    });
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    await this.redisClient.hset(key, field, value);
  }
  
  async hget(key: string, field: string): Promise<string> {
    return await this.redisClient.hget(key, field);
  }
  
  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
  
}
