import { Injectable } from '@nestjs/common';
import { log } from 'console';
import Groq from 'groq-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GroqService {
  private groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env['GOOGLE_GEN_AI_API_KEY'],
    });
  }

  // Method to generate a new unique ID for each request
  generateRequestId(): string {
    return uuidv4();
  }

  async getChatCompletion(message: string, userId: string) {
    const requestId = this.generateRequestId();
    const messageId = uuidv4(); // Generate a unique messageId
    log('RequestId:', requestId, 'MessageId:', messageId, 'UserId:', userId);
    
    const chatCompletion = await this.groq.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: process.env['MODEL'],
    });

    const responseId = uuidv4(); // Generate a unique responseId
    log('Chat Completion:', chatCompletion.choices[0]?.message?.content || '', 'ResponseId:', responseId);

    return {
      requestId,
      messageId,
      userId,
      responseId,
      content: chatCompletion.choices[0]?.message?.content || '',
    };
  }

  async getChatCompletionOfImage(message: string, userId: string) {
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
              text: 'What\'s in this image? Can You Extract the text from this image? And return me in JSON object',
            },
            {
              type: 'image_url',
              image_url: {
                url: message,
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

    const responseId = uuidv4(); // Generate a unique responseId
    log('Chat Completion:', chatCompletion.choices[0]?.message?.content || '', 'ResponseId:', responseId);

    return {
      requestId,
      messageId,
      userId,
      responseId,
      content: chatCompletion.choices[0]?.message?.content || '',
    };
  }
}
