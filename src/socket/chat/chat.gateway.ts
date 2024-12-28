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
    
    // Store or validate room metadata
    await this.redisService.hset(`room:${roomId}`, client.id, 'connected');
  }

  async handleDisconnect(client: Socket) {
    const roomId = client.handshake.query.roomId as string;
    await this.redisService.del(`room:${roomId}`);
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

    // Publish the message to the room's channel
    await this.redisService.publish(`room:${roomId}:messages`, message);

    // Broadcast to other participants in the room
    client.broadcast.to(roomId).emit('receive_message', message);
  }

  @SubscribeMessage('subscribe_to_chat')
  async handleSubscribe(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    // Join the socket.io room
    client.join(roomId);

    // Subscribe to the Redis channel for the room
    await this.redisService.subscribe(`room:${roomId}:messages`, (message) => {
      client.emit('receive_message', message);
    });
  }
}
