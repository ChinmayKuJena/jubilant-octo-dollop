import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async getAllKeys(pattern: string = '*'): Promise<string[]> {
    return await this.redisClient.keys(pattern);
  }
  // Message operations using Redis Lists
  async addMessageToRoom(roomId: string, message: string): Promise<void> {
    const key = `room:${roomId}:messages`;
    await this.redisClient.lpush(key, message);
    await this.redisClient.expire(key, 1200); // 20-minute expiration
  }

  async getMessagesForRoom(roomId: string): Promise<string[]> {
    const key = `room:${roomId}:messages`;
    return await this.redisClient.lrange(key, 0, -1);
  }

  // Metadata operations using Redis Hashes
  async setRoomMetadata(roomId: string, userId: string, status: string): Promise<void> {
    const key = `room:${roomId}`;
    await this.redisClient.hset(key, userId, status);
  }

  async getRoomMetadata(roomId: string): Promise<Record<string, string>> {
    const key = `room:${roomId}`;
    return await this.redisClient.hgetall(key);
  }

  async deleteRoomMetadata(roomId: string): Promise<void> {
    const key = `room:${roomId}`;
    await this.redisClient.del(key);
  }
}
