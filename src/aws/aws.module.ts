import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { PollyService } from './polly.service';

@Module({
  exports: [AwsService,PollyService],
  providers: [AwsService,PollyService]
})
export class AwsModule {}
