import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { GroqService } from 'src/groq/groq.service';
import { Server, Socket } from 'socket.io';
import { Prompts } from 'src/utils/promopts';

@WebSocketGateway({
  namespace: '/mychat1',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
})
export class AiChatGateway {
  @WebSocketServer() server: Server;

  private readonly logger = new Logger(AiChatGateway.name);

  constructor(private readonly groqService: GroqService) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    const roomId = `room-${client.id}-${Date.now()}`;
    client.emit('connected', { clientId: client.id, roomId });
    client.join(roomId);
    try {
      const randomWelcomeMessage =
        Prompts.welcome[Math.floor(Math.random() * Prompts.welcome.length)];

      // Combine with personal details for a personalized greeting
      const personalDetails =
        Prompts.personalDetails[
          Math.floor(Math.random() * Prompts.personalDetails.length)
        ];

      const fullGreeting = `${randomWelcomeMessage} ${personalDetails}.In Few Words`;
      const greeting =
        await this.groqService.getChatCompletionWithPrompt(fullGreeting);
      client.emit('message', { content: greeting.content });
      this.logger.log(
        `Sent greeting to client ${client.id}: ${greeting.content}`,
      );
    } catch (error) {
      this.logger.error('Error sending greeting', error);
      client.emit('message', { content: 'Error generating greeting.' });
    }
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: string) {
    this.logger.log(`Received message: ${message}`);
    try {
      const response =
        await this.groqService.getChatCompletionWithPrompt(message);
      this.logger.log(`Sending response: ${response.content}`);
      return {
        requestId: response.requestid,
        content: response.content,
      };
    } catch (error) {
      this.logger.error('Error generating response', error);
      return { content: 'Error processing your message.' };
    }
  }
}
