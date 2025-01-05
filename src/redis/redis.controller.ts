import { Controller, Get, Param, Query } from '@nestjs/common';
import { RedisService } from './redis.service';
import { AllowAnonymous } from 'src/auth/allowAll.metas';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}
  @Get('room/:roomId/metadata')
  async getRoomMetadata(@Param('roomId') roomId: string) {
    return this.redisService.getRoomMetadata(roomId);
  }

  @Get('room/:roomId/messages')
  async getRoomMessages(@Param('roomId') roomId: string) {
    return this.redisService.getMessagesForRoom(roomId);
  }
  @Get('rooms')
  async getAllRooms() {
    // Implement logic to list all active rooms (can be based on keys in Redis)
    // Example: Fetch keys matching `room:*` and extract room IDs
    return this.redisService.getAllRooms();
    // return ['room1232']; // Mock data
  }
}
