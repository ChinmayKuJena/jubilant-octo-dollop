import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import Groq from 'groq-sdk';
import { v4 as uuidv4 } from 'uuid';
import { GroqDbService } from './groq.db.service';

@Injectable()
export class GroqServiceBackeUp {
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

  async getChatCompletion(
    request: string,
    userId: string,
    roomId: string,
    clientid: string,
  ) {
    const requestid = this.generateRequestId();
    log('RequestId:', requestid);

    const response = await this.groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'you are a helpful teaching assistant.If Some One ask about Type Of assistant Tell Them u are Teacher_09',
        },
        { role: 'user', content: request },
      ],
      model: process.env['MODEL'],
    });

    const responseid = uuidv4();
    log('Chat Completion:', response.choices[0]?.message?.content || '');
    // try {
    //   await this.groqRepository.createGroqRecord({
    //     requestid,
    //     responseid,
    //     request,
    //     userid: userId,
    //     response: response.choices[0]?.message?.content || '',
    //     roomid: roomId,
    //     clientid: userId,
    //     createdat: new Date(),
    //   });
    // } catch (error) {
    //   console.error('Error creating Groq record:', error);
    //   // You can log or handle the error as needed, but this will ensure it doesn't stop the execution.
    // }
    return {
      requestid,
      responseid,
      userId,
      content: response.choices[0]?.message?.content || '',
    };
  }
  async handleImageInput(url: string): Promise<any> {
    // Check if the URL is valid and exists
    if (!url) {
      throw new Error('Invalid image URL');
    }

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: "What's in this image?",
              },
              {
                type: 'image_url',
                image_url: {
                  url: 'https://test9990069.s3.ap-south-1.amazonaws.com/quantum/channels4_profile.jpg',
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
      });

      // Simplify and format the response for easier output
      return {
        message:
          chatCompletion.choices[0]?.message?.content ||
          'No response from API.',
        imageUrl: url,
      };
    } catch (error) {
      console.error('Error processing image URL:', error);
      throw new Error('Error processing image URL');
    }
  }

  async getChatCompletionOfImage(
    message: string,
    url: string,
    userId: string,
    roomId: string,
    clientid: string,
  ) {
    const requestId = this.generateRequestId();
    const messageId = uuidv4(); // Generate a unique messageId
    log('RequestId:', requestId, 'MessageId:', messageId, 'UserId:', userId);
    let chatCompletion: any = null;
    try {
      chatCompletion = await this.groq.chat.completions.create({
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
    } catch (error) {
      console.error('Error creating Groq Image:', error);
      // You can log or handle the error as needed, but this will ensure it doesn't stop the execution.
    }

    // try {
    //   await this.groqRepository.createGroqRecord({
    //     requestid: requestId,
    //     responseid: uuidv4(),
    //     request: `${message} .-. ${url}`,
    //     userid: userId,
    //     response: chatCompletion.choices[0]?.message?.content || '',
    //     roomid: roomId,
    //     clientid: userId,
    //     createdat: new Date(),
    //   });
    // } catch (error) {
    //   console.error('Error creating Groq record:', error);
    //   // You can log or handle the error as needed, but this will ensure it doesn't stop the execution.
    // }
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
