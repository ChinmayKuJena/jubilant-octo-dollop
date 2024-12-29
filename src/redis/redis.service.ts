import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  // Store message with metadata
  async addMessageToRoom(
    roomId: string,
    userId: string,
    userName:string,
    message: string,
  ): Promise<void> {
    const key = `room:${roomId}:messages`;
    const timestamp = new Date().toISOString();

    const messageObject = {
      message,
      userName,
      userId,
      timestamp,
    };

    // Push the serialized JSON message into the Redis List
    await this.redisClient.lpush(key, JSON.stringify(messageObject));
    await this.redisClient.expire(key, 1200); // 20-minute expiration
  }

  // Retrieve all messages for a room
  async getMessagesForRoom(roomId: string): Promise<Record<string, any>[]> {
    const key = `room:${roomId}:messages`;
    const messages = await this.redisClient.lrange(key, 0, -1);

    // Deserialize JSON strings into objects
    return messages.map((message) => JSON.parse(message));
  }

  // Metadata operations remain unchanged
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
