import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { TextChatSocketGateway } from "./textchat.socket.gateway";
import { AwsModule } from 'src/aws/aws.module';
import { GroqModule } from 'src/groq/groq.module';
import { SocketDbService } from './socket.db.service';
import { SocketDataEntity } from './socketdata.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagechatGateway } from './imagechat/imagechat.gateway';
import { ChatGateway } from './chat/chat.gateway';
import { RedisModule } from 'src/redis/redis.module';
import { AiChatGateway } from './ai-chat/ai-chat.gateway';
import { LiveLocationGateway } from './location/location.gateway';
import { FriendRequestGateway } from './request/request.gateway';
import { UsersModule } from 'src/users/users.module';
import { NotificationGateway } from './notification/notification.gateway';

@Module({
  imports:[
    TypeOrmModule.forFeature([SocketDataEntity]),

    AwsModule,
    GroqModule,
    RedisModule,
    UsersModule
  ],
  providers: [SocketService, TextChatSocketGateway,SocketDbService, ImagechatGateway, ChatGateway, AiChatGateway, LiveLocationGateway, FriendRequestGateway, NotificationGateway]
})
export class SocketModule {}
