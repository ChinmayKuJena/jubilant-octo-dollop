import { Test, TestingModule } from '@nestjs/testing';
import { LocationGateway } from './location.gateway';

describe('LocationGateway', () => {
  let gateway: LocationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationGateway],
    }).compile();

    gateway = module.get<LocationGateway>(LocationGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
