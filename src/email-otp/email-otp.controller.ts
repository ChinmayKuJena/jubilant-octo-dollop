import { Body, Controller, Post } from '@nestjs/common';
import { EmailOtpService } from './email-otp.service';
import { AllowAnonymous } from 'src/auth/allowAll.metas';

@Controller('email')
export class EmailOtpController {
  constructor(private readonly emailOtpService: EmailOtpService) {}

  @Post('verify')
  // @AllowAnonymous()
  // @HttpCode(200)
  @AllowAnonymous()
  async verifyOtp(
    @Body() body: { email: string; otp: string },
  ): Promise<boolean> {
    const { email, otp } = body;
    // Make sure to await the async verifyOtp call properly
    return await this.emailOtpService.verifyOtp(email, otp);
  }
}
