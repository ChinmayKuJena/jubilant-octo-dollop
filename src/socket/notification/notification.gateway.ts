import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from 'src/redis/redis.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({ namespace: 'friends1', cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;
  
  private connectedUsers: Map<string, string> = new Map();  // Map username to socket ID

  constructor(
    private readonly userService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const username = [...this.connectedUsers.entries()].find(([_, socketId]) => socketId === client.id)?.[0];
    if (username) this.connectedUsers.delete(username);
  }

  @SubscribeMessage('register')
  async registerUser(@MessageBody() data: { username: string }, @ConnectedSocket() client: Socket) {
    const user = await this.userService.getUser(data.username);
    if (!user) {
      client.emit('error',`User ${data.username} not found.`)
      throw new Error(`User ${data.username} not found.`);
    }
    this.connectedUsers.set(data.username, client.id);
    console.log(`User ${data.username} registered with socket ID ${client.id}`);
  }

  @SubscribeMessage('send-friend-request')
  async sendFriendRequest(@MessageBody() data: { sender: string, recipient: string }) {
    const { sender, recipient } = data;

    // Check if recipient exists
    const user = await this.userService.getUser(recipient);
    if (!user) {
      throw new Error('Recipient not found.');
    }

    // Save the notification to Redis
    await this.redisService.saveNotification(recipient, sender, 'Friend request sent.');

    // Notify recipient in real-time
    this.notifyRecipient(recipient, {
      sender,
      status: 'Sent'
    });
  }

  @SubscribeMessage('fetch-notifications')
  async fetchNotifications(@MessageBody() data: { username: string }, @ConnectedSocket() client: Socket) {
    const notifications = await this.redisService.getNotifications(data.username);
    client.emit('notifications', notifications);
  }

  private async notifyRecipient(recipient: string, notification: any) {
    const recipientSocketId = this.connectedUsers.get(recipient);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('notification', notification);
    }
  }
}
