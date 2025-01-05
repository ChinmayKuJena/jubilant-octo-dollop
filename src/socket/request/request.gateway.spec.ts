import { Test, TestingModule } from '@nestjs/testing';
import { RequestGateway } from './request.gateway';

describe('RequestGateway', () => {
  let gateway: RequestGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestGateway],
    }).compile();

    gateway = module.get<RequestGateway>(RequestGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
