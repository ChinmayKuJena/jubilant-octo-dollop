import { Test, TestingModule } from '@nestjs/testing';
import { ImagechatGateway } from './imagechat.gateway';

describe('ImagechatGateway', () => {
  let gateway: ImagechatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagechatGateway],
    }).compile();

    gateway = module.get<ImagechatGateway>(ImagechatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
