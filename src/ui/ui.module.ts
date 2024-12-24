import { Module } from '@nestjs/common';
import { UiController } from './ui.controller';

@Module({
  controllers: [UiController]
})
export class UiModule {}
