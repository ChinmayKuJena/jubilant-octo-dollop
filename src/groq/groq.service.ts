import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import Groq from 'groq-sdk';
import { botStory, Prompts } from 'src/utils/promopts';

@Injectable()
export class GroqService {
  private groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env['GOOGLE_GEN_AI_API_KEY'], // Set your API Key in environment variables
    });
  }

  // Generate a new unique ID for each request
  generateRequestId(): string {
    return uuidv4();
  }

  // Generate a chatbot response with a friendly tone and behavior
  async getChatCompletionWithPrompt(request: string): Promise<any> {
    const requestid = this.generateRequestId();
    const behavior = Prompts.behavior; // Fetch tone and style from configuration
    const storyTriggers = ["who are you", "tell me about yourself", "what is your story"];
    const storyResponse = botStory.story;

    const response = await this.groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a chatbot with a ${behavior.tone} tone and ${behavior.style} style. Your role is: ${behavior.role}. You will only tell the story if the user specifically asks about it. If the user asks "tell me about yourself", or "what is your story", share the following story: ${storyResponse}`,
          // content: `You are a chatbot with a ${behavior.tone} tone and ${behavior.style} style. Your role is: ${behavior.role}.`,
        },
        { role: 'user', content: request },
      ],
      model: process.env['MODEL'], // Set the model name, e.g., 'gpt-3.5-turbo'
    });

    return {
      requestid,
      content: response.choices[0]?.message?.content || '',
    };
  }
}
