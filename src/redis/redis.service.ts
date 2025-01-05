import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  // Store message with metadata
  async addMessageToRoom(
    roomId: string,
    userId: string,
    userName: string,
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
  async getAllRooms(): Promise<string[]> {
    const keys = await this.redisClient.keys('room:*');
    return keys.map((key) => key.split(':')[1]);
  }
  // Retrieve all messages for a room
  async getMessagesForRoom(roomId: string): Promise<Record<string, any>[]> {
    const key = `room:${roomId}:messages`;
    const messages = await this.redisClient.lrange(key, 0, -1);

    // Deserialize JSON strings into objects
    return messages.map((message) => JSON.parse(message));
  }

  // Metadata operations remain unchanged
  async setRoomMetadata(
    roomId: string,
    userId: string,
    status: string,
  ): Promise<void> {
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

  // Store a friend request temporarily in Redis (with TTL)
  async storeFriendRequest(sender: string, recipient: string): Promise<void> {
    const requestKey = `friend_request:${recipient}`;
    const timestamp = new Date().toISOString();

    const requestObject = {
      sender,
      recipient,
      timestamp,
    };

    // Store the request as a JSON object in Redis list
    await this.redisClient.rpush(requestKey, JSON.stringify(requestObject));
    await this.redisClient.expire(requestKey, 3600); // Set TTL for 1 hour
  }

  // Get pending friend requests for a user
  async getPendingFriendRequests(recipient: string): Promise<any[]> {
    const requestKey = `friend_request:${recipient}`;
    const requests = await this.redisClient.lrange(requestKey, 0, -1);
    return requests.map((request) => JSON.parse(request));
  }

  // Notify the user (can be tied to WebSocket or other logic)
  async notifyUser(user: string, notification: string): Promise<void> {
    const notificationKey = `user:${user}:notifications`;
    const notificationObject = {
      message: notification,
      timestamp: new Date().toISOString(),
    };
    // Store notification in Redis
    await this.redisClient.lpush(
      notificationKey,
      JSON.stringify(notificationObject),
    );
    await this.redisClient.expire(notificationKey, 3600); // 1-hour TTL
  }

  // Retrieve notifications for a user
  async getNotificationsForUser(user: string): Promise<any[]> {
    const notificationKey = `user:${user}:notifications`;
    const notifications = await this.redisClient.lrange(notificationKey, 0, -1);
    return notifications.map((notification) => JSON.parse(notification));
  }

  async saveNt(recipient: string, sender: string, notification: any) {
    try {
      // Redis key for the recipient's notifications (using the recipient's username as the key)
      const notificationKey = `notifications:${recipient}`;

      // Serialize the notification (if it's an object, you might want to convert it to a string)
      const notificationData = JSON.stringify({
        sender,
        message: notification,
        timestamp: new Date().toISOString(),  // You can add timestamp for sorting later if needed
      });

      // Add the notification to the list of messages for the recipient
      await this.redisClient.lpush(notificationKey, notificationData);

      // Optionally, set an expiration time on the key (e.g., 1 week)
      // await this.redisClient.expire(notificationKey, 60 * 60 * 24 * 7); // Expires in 7 days

      console.log(`Notification added for ${recipient}: ${notificationData}`);
    } catch (error) {
      console.error('Error adding message to Redis:', error);
      throw new Error('Failed to add message to Redis');
    }
  }
  /*
  lets test
  */
  async saveNotification(recipient: string, sender: string, notification: string): Promise<void> {
    const notificationKey = `notifications:${recipient}`;
    const notificationData = JSON.stringify({
      sender,
      message: notification,
      timestamp: new Date().toISOString(),
    });
    await this.redisClient.lpush(notificationKey, notificationData);
    await this.redisClient.expire(notificationKey, 3600); // 1 hour TTL
  }

  async getNotifications(recipient: string): Promise<any[]> {
    const notificationKey = `notifications:${recipient}`;
    const notifications = await this.redisClient.lrange(notificationKey, 0, -1);
    return notifications.map((notification) => JSON.parse(notification));
  }
}
