import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { PollyService } from './polly.service';
import { MulterModule } from '@nestjs/platform-express';
import { S3Controller } from './s3/s3.controller';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Temporary local storage
    }),
  ],
  exports: [AwsService,PollyService],
  providers: [AwsService,PollyService,S3Service],
  controllers: [S3Controller]
})
export class AwsModule {}
