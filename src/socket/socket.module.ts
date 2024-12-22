import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { AwsModule } from 'src/aws/aws.module';
import Groq from 'groq-sdk';
import { GroqModule } from 'src/groq/groq.module';

@Module({
  imports:[
    AwsModule,
    GroqModule
  ],
  providers: [SocketService, SocketGateway]
})
export class SocketModule {}
