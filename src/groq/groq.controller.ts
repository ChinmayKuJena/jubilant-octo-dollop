import { Controller, Get, Query } from '@nestjs/common';
import { GroqService } from './groq.service';
import { AllowAnonymous } from 'src/auth/allowAll.metas';
import { GroqServiceBackeUp } from './groq.service-backup';

@Controller('groq')
export class GroqController {
  constructor(private readonly groqService: GroqServiceBackeUp) {}

//   @Get('process-image')
//   async processImage(@Query('url') url: string) {
//     if (!url) {
//       return { message: 'Please provide a valid image URL' };
//     }
//     const result = await this.groqService.handleImageInput(url);
//     return result;
//   }

  @Get('demo-image-url')
  @AllowAnonymous()
  async demoImageUrl() {
    const demoUrl = 'https://test9990069.s3.ap-south-1.amazonaws.com/uploads/image1_9_0.png';
    const result = await this.groqService.handleImageInput(demoUrl);
    //    const result = await this.groqService.getChatCompletion("What Type of assistant ai u are ?","iuu","s","sd");
    return {
      message: result,
      demoUrl,
    };
  }
}
