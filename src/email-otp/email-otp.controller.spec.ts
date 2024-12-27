import { Test, TestingModule } from '@nestjs/testing';
import { EmailOtpController } from './email-otp.controller';

describe('EmailOtpController', () => {
  let controller: EmailOtpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailOtpController],
    }).compile();

    controller = module.get<EmailOtpController>(EmailOtpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
