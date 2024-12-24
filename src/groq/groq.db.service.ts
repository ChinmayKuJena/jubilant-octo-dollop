// groq.db.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {  GroqEntity } from './groq.entity';

@Injectable()
export class GroqDbService {
  constructor(
    @InjectRepository(GroqEntity)
    private groqRepository: Repository<GroqEntity>,
  ) {}

  // Method to save a new GROQ record
  async createGroqRecord(data: Partial<GroqEntity>): Promise<GroqEntity> {
    const newGroq = this.groqRepository.create(data);
    return this.groqRepository.save(newGroq);
  }

  // Method to get all GROQ records for a user or room
  async getGroqRecordsByUserOrRoom(userid: string, roomid: string): Promise<GroqEntity[]> {
    return this.groqRepository.find({
      where: [{ userid }, { roomid }],
      order: { createdat: 'ASC' }, // Optional: order by createdAt
    });
  }

  // Method to get a single GROQ record by requestId
  async getGroqRecordById(requestid: string): Promise<GroqEntity> {
    return this.groqRepository.findOneBy({ requestid });
  }
}
