import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { AwsModule } from 'src/aws/aws.module';
import { GroqModule } from 'src/groq/groq.module';
import { SocketDbService } from './socket.db.service';
import { SocketDataEntity } from './socketdata.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forFeature([SocketDataEntity]),

    AwsModule,
    GroqModule
  ],
  providers: [SocketService, SocketGateway,SocketDbService]
})
export class SocketModule {}
