import { Controller, Get, HttpException, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { PollyService } from './aws/polly.service';
import { Response } from 'express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private pollyService:PollyService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('synthesize')
  async synthesizeSpeech(@Res() res: Response) {
    try {
      const text = 'Hello, world!';

      const audioBuffer = await this.pollyService.synthesizeSpeech(
        text,
        'Joanna',
      );
      res.setHeader('Content-Type', 'audio/mpeg');
      res.send(audioBuffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
