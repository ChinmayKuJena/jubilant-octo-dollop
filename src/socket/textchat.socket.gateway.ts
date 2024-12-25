import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { PollyService } from 'src/aws/polly.service';
import { GroqService } from 'src/groq/groq.service';

@WebSocketGateway({
  namespace: '/mychat', // Set the custom namespace/path here

  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
})
export class TextChatSocketGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly pollyService: PollyService,
    private readonly groqService: GroqService,
  ) {}

  afterInit() {
    console.log('WebSocket Gateway Initialized');
  }

  // Handle client connection
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    const roomId = `room-${client.id}-${Date.now()}`;

    this.socketService.addClient(client.id, roomId);

    client.emit('connected', { clientId: client.id, roomId });
    console.log(`Client connected: ${client.id} to room: ${roomId}`);

    // Optionally, auto-join the client to the generated room
    client.join(roomId);
  }

  // Handle client disconnection
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.socketService.removeClient(client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() { roomId, userName }: { roomId: string; userName: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!roomId || !userName) {
      client.emit('error', 'Room ID and User Name are required');
      return;
    }

    // Check if the room is already occupied
    const isRoomOccupied = this.socketService.rooms.get(roomId);
    if (isRoomOccupied) {
      client.emit('error', 'Room is already occupied by another user');
      return;
    }

    // Allow joining the room
    const success = this.socketService.joinRoom(client.id, roomId, userName);
    if (success) {
      client.join(roomId);
      console.log(`${userName} joined room: ${roomId}`);
      this.server.to(roomId).emit('userJoined', { userName });
    } else {
      client.emit('error', 'Failed to join room');
    }
  }

  // Send a message
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() { roomId, message,url }: { roomId: string; message: string ,url:string},//url for image ai 
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.socketService.getClient(client.id);
    if (!user) {
      client.emit('error', 'User not found');
      return;
    }

    if (!roomId || !message) {
      client.emit('error', 'Room ID and Message are required');
      return;
    }

    console.log(`Message from ${user.userName} in room ${roomId}: ${message}, ${url}`);

    try {
      // Get response from GroqService
      const result = await this.groqService.getChatCompletionOfImage(
        message,
        url,
        client.id,
        roomId,
        client.id,
      );
      // const result = await this.groqService.getChatCompletion(
      //   message,
      //   client.id,
      //   roomId,
      //   client.id,
      // );

      // // Generate audio using PollyService
      // const audioBuffer = await this.pollyService.synthesizeSpeech(
      //   result.content,
      //   'Joanna',
      // );
      console.log("Output",result.content);
      
      // Store the message
      this.socketService.storeMessage(roomId, {
        userId: client.id,
        userName: user.userName,
        message,
        timestamp: new Date(),
      });

      // Broadcast the message and audio to the room
      this.server.to(roomId).emit('receiveMessage', {
        
        userName: user.userName,
        content: result.content,
      });
      // this.server
      //   .to(roomId)
      //   .emit('audioMessage', audioBuffer.toString('base64'));
    } catch (error) {
      console.error('Error processing message:', error);
      client.emit('error', 'Failed to process the message');
    }
  }
}
