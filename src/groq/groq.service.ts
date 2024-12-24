import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import Groq from 'groq-sdk';
import { v4 as uuidv4 } from 'uuid';
import { GroqEntity } from './groq.entity';
import { GroqDbService } from './groq.db.service';

@Injectable()
export class GroqService {
  private groq;

  constructor(private readonly groqRepository: GroqDbService) {
    log('GroqDbService:', this.groqRepository); // Log this object to ensure it's correctly initialized

    this.groq = new Groq({
      apiKey: process.env['GOOGLE_GEN_AI_API_KEY'],
    });
  }

  // Method to generate a new unique ID for each request
  generateRequestId(): string {
    return uuidv4();
  }

  async getChatCompletion(request: string, userId: string,roomId: string,clientid: string) {
    const requestid = this.generateRequestId();
    log('RequestId:', requestid);

    const response = await this.groq.chat.completions.create({
      messages: [{ role: 'user', content: request }],
      model: process.env['MODEL'],
    });

    const responseid = uuidv4();
    log('Chat Completion:', response.choices[0]?.message?.content || '');

    await this.groqRepository.createGroqRecord({
      requestid,
      responseid,
      request,
      userid: userId,
      response: response.choices[0]?.message?.content || '',
      roomid: roomId,
      clientid: userId,
      createdat: new Date(),
    });
    return {
      requestid,
      responseid,
      userId,
      content: response.choices[0]?.message?.content || '',
    };
  }

  async getChatCompletionOfImage(message: string,url:string, userId: string) {
    const requestId = this.generateRequestId();
    const messageId = uuidv4(); // Generate a unique messageId
    log('RequestId:', requestId, 'MessageId:', messageId, 'UserId:', userId);

    const chatCompletion = await this.groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: message,
              // text: "What's in this image? Can You Extract the text from this image? And return me in JSON object",
            },
            {
              type: 'image_url',
              image_url: {
                url: url,
              },
            },
          ],
        },
      ],
      model: process.env['VISION_MODEL'],
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    // log('Chat Completion:', chatCompletion);
    // log('Chat Completion:', chatCompletion.choices[0]?.message?.content || '');

    return {
      requestId,
      messageId,
      userId,
      content: chatCompletion.choices[0]?.message?.content || '',
    };
  }
}
