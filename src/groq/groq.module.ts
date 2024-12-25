import { Module } from '@nestjs/common';
import { GroqService } from './groq.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroqEntity } from './groq.entity';
import { GroqDbService } from './groq.db.service';
import { GroqController } from './groq.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroqEntity]),

  ],
  controllers: [GroqController],
  providers: [GroqService,GroqDbService],
  exports: [GroqService,GroqDbService],
})
export class GroqModule {}
