import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/web.auth';
import { RedisService } from 'src/redis/redis.service';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly redisService: RedisService) {}

  async handleConnection(client: Socket) {
    const roomId = client.handshake.query.roomId as string;
    console.log(`Client ${client.id} connected to room ${roomId}`);
    
    // Set user metadata in Redis
    const userId = client.id;
    await this.redisService.setRoomMetadata(roomId, userId, 'connected');
  }

  async handleDisconnect(client: Socket) {
    const roomId = client.handshake.query.roomId as string;
    const userId = client.id;

    // Remove user metadata
    await this.redisService.setRoomMetadata(roomId, userId, 'disconnected');
    console.log(`Client ${client.id} disconnected from room ${roomId}`);
  }

  @SubscribeMessage('send_message')
  @UseGuards(AuthGuard)
  async handleMessage(
    @MessageBody() data: { roomId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, message } = data;
    console.log(`Message to room ${roomId}: ${message}`);

    // Add message to Redis list
    await this.redisService.addMessageToRoom(roomId, message);

    // Broadcast the message to other users in the room
    client.broadcast.to(roomId).emit('receive_message', message);
  }

  @SubscribeMessage('subscribe_to_chat')
  async handleSubscribe(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    // Join the room in Socket.IO
    client.join(roomId);

    // Retrieve past messages from Redis
    const messages = await this.redisService.getMessagesForRoom(roomId);

    // Send past messages to the newly connected user
    messages.reverse().forEach((message) => {
      client.emit('receive_message', message);
    });
  }
}
