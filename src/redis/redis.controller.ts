import { Controller, Get, Param, Query } from '@nestjs/common';
import { RedisService } from './redis.service';
import { AllowAnonymous } from 'src/auth/allowAll.metas';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}
  // @Get('keys')
  // @AllowAnonymous()
  // async getKeys(@Query('pattern') pattern: string): Promise<string[]> {
  //   return this.redisService.getAllKeys(pattern);
  // }
  // @Get('set')
  // async setTestData() {
  //   await this.redisService.set('testKey', 'Hello from Redis');
  //   return 'Data saved to Redis';
  // }

  // @Get('get')
  // async getTestData() {
  //   const value = await this.redisService.get('testKey');
  //   return `Data from Redis: ${value}`;
  // }


//   @Get('room/:roomId/messages')
//   @AllowAnonymous()
//   async getRoomMessages(@Param('roomId') roomId: string): Promise<{ messages: string[] }> {
//     const messages = await this.redisService.getMessagesForRoom(roomId);
//     return { messages };
//   }
  
//   /**
//    * Get metadata for a given room.
//    * @param roomId The ID of the room.
//    * @returns Room metadata in JSON format.
//   */
//  @Get('room/:roomId/metadata')
//  @AllowAnonymous()
//   async getRoomMetadata(@Param('roomId') roomId: string): Promise<{ metadata: Record<string, string> }> {
//     const metadata = await this.redisService.getRoomMetadata(roomId);
//     return { metadata };
//   }
//   @Get('rooms')
//   @AllowAnonymous()
//   async getAllRooms(): Promise<{ messageRooms: string[]; metadataRooms: string[] }> {
//     const messageRoomsPattern = 'room:*:messages';
//     const metadataRoomsPattern = 'room:*';

//     // Extract only the room IDs (strip prefixes)
//     const messageKeys = await this.redisService.getAllKeys(messageRoomsPattern);
//     const metadataKeys = await this.redisService.getAllKeys(metadataRoomsPattern);

//     const messageRooms = messageKeys.map((key) => key.replace('room:', '').replace(':messages', ''));
//     const metadataRooms = metadataKeys.map((key) => key.replace('room:', ''));

//     return { messageRooms, metadataRooms };
//   }
}
