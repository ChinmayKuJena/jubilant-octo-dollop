import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { log } from 'console';

@Injectable()
export class PollyService {
  private polly: AWS.Polly;

  constructor() {
    // Configure AWS Polly with credentials
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    this.polly = new AWS.Polly();
  }

  // Method to synthesize speech
  async synthesizeSpeech(text: string, voiceId: string = 'Gregory'): Promise<Buffer> {
    const params: AWS.Polly.SynthesizeSpeechInput = {
      Text: text,
      OutputFormat: 'mp3', 
      VoiceId: voiceId,
      // VoiceId: voiceId,
    };

    try {
      const response = await this.polly.synthesizeSpeech(params).promise();
      if (response.AudioStream) {
        log('Speech synthesized successfully');
        return Buffer.from(response.AudioStream as Buffer);
      }
      throw new Error('Audio stream is empty');
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw error;
    }
  }
}
