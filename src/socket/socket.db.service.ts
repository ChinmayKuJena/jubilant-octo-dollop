// socket.db.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocketDataEntity } from './socketdata.entity';

@Injectable()
export class SocketDbService {
  constructor(
    @InjectRepository(SocketDataEntity)
    private socketDataRepository: Repository<SocketDataEntity>,
  ) {}

  // Method to save a new SocketData record
  async createSocketDataRecord(data: Partial<SocketDataEntity>): Promise<SocketDataEntity> {
    const newSocketData = this.socketDataRepository.create(data);
    return this.socketDataRepository.save(newSocketData);
  }

  // Method to get all socket records for a room
  async getSocketDataByRoom(roomid: string): Promise<SocketDataEntity[]> {
    return this.socketDataRepository.find({
      where: { roomid },
    });
  }

  // Method to get SocketData by userId
  async getSocketDataByUser(userid: number): Promise<SocketDataEntity[]> {
    return this.socketDataRepository.find({
      where: { userid },
    });
  }

  // Method to get a single SocketData record by roomId
  async getSocketDataByRoomId(roomid: string): Promise<SocketDataEntity> {
    return this.socketDataRepository.findOneBy({ roomid });
  }
}
