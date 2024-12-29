import { Test, TestingModule } from '@nestjs/testing';
import { AiChatGateway } from './ai-chat.gateway';

describe('AiChatGateway', () => {
  let gateway: AiChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiChatGateway],
    }).compile();

    gateway = module.get<AiChatGateway>(AiChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
