import { Injectable, Inject } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailOtpService {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    // Configure transporter using environment variables
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async generateAndSendOtp(email: string): Promise<any> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.cacheManager.set(email, otp);
    const savedOtp = await this.cacheManager.get<string>(email);
    console.log(`OTP saved in cache for ${email}:`, savedOtp);

    // await this.sendOtpEmail(email, otp);

    return {
      message: `OTP has been sent to ${email}`,
    };
  }

  // Method to send OTP via email
  private async sendOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
      to: email,
      subject: 'Your OTP for Verification',
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('OTP email sent to', email);
    } catch (error) {
      console.error('Error sending OTP email', error);
      throw new Error('Error sending OTP email');
    }
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    console.log(`Email received for verification: ${email}`);
    const cachedOtp = await this.cacheManager.get<string>(email);
    console.log(`Cached OTP for ${email}: ${cachedOtp}`);

    if (cachedOtp && cachedOtp === otp) {
      await this.cacheManager.del(email);
      return true;
    }

    return false;
  }
}
