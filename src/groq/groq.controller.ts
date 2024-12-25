import { Controller, Get, Query } from '@nestjs/common';
import { GroqService } from './groq.service';

@Controller('groq')
export class GroqController {
  constructor(private readonly groqService: GroqService) {}

//   @Get('process-image')
//   async processImage(@Query('url') url: string) {
//     if (!url) {
//       return { message: 'Please provide a valid image URL' };
//     }
//     const result = await this.groqService.handleImageInput(url);
//     return result;
//   }

  @Get('demo-image-url')
  async demoImageUrl() {
    const demoUrl = 'https://test9990069.s3.ap-south-1.amazonaws.com/uploads/image1_9_0.png';
    const result = await this.groqService.handleImageInput(demoUrl);
    return {
      message: result,
      demoUrl,
    };
  }
}
