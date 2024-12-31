import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import Groq from 'groq-sdk';
import { botStory, Prompts } from 'src/utils/promopts';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GroqService {
  private groq;
  logger: any;

  constructor(private readonly configService: ConfigService) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>('GOOGLE_GEN_AI_API_KEY'),
    });
  }

  // Generate a new unique ID for each request
  generateRequestId(): string {
    return uuidv4();
  }

  async getChatCompletionWithPrompt(request: string): Promise<any> {
    const requestId = this.generateRequestId();
    const behavior = Prompts.behavior;

    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Your Name is MANCHI0905 chatbot with a ${behavior.tone} tone and ${behavior.style} style. Your role is: ${behavior.role}.`,
          },
          { role: 'user', content: request },
        ],
        model: process.env['MODEL'],
      });

      if (!response || !response.choices?.length) {
        throw new Error('Invalid response from Groq API');
      }

      return {
        requestId,
        content: response.choices[0]?.message?.content || '',
      };
    } catch (error) {
      this.logger.error('Error in getChatCompletionWithPrompt', error);
      return {
        requestId,
        content: 'Error processing your request. Please try again later.',
      };
    }
  }
}
