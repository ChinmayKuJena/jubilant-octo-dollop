import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/live-location',
  cors: {
    origin: ['*',],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
})
export class LiveLocationGateway {
  @WebSocketServer() server: Server;

  private readonly logger = new Logger(LiveLocationGateway.name);

  // Store room data
  private roomData: Record<string, any> = {};

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId } = data;
    client.join(roomId);
    this.logger.log(`User ${userId} joined room ${roomId}`);
    client.emit('joinedRoom', { roomId });
  }

  @SubscribeMessage('updateLocation')
  handleUpdateLocation(
    @MessageBody() data: { roomId: string; userId: string; location: { latitude: number; longitude: number } },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId, location } = data;

    // Save user location in roomData
    if (!this.roomData[roomId]) {
      this.roomData[roomId] = {};
    }
    this.roomData[roomId][userId] = location;

    this.logger.log(
      `Location update from user ${userId} in room ${roomId}: ${JSON.stringify(location)}`,
    );

    // Broadcast updated location to all users in the room
    this.server.to(roomId).emit('locationUpdate', { userId, location });
  }
}
