import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Get,
    Res,
    Param,
    Delete,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { InternalServerErrorException } from '@nestjs/common';
  import * as path from 'path';
  import * as fs from 'fs';
  import { diskStorage } from 'multer';
  import { Response } from 'express';
  import { log } from 'console';
import { S3Service } from './s3.service';
@Controller('s3')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Post('uploads3')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          // destination: './uploads', // Temporary folder for uploading
          filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${Date.now()}${ext}`);
          },
        }),
      }),
    )
    async uploadToS3(@UploadedFile() file: Express.Multer.File): Promise<any> {
      try {
        console.log('Received file:', file);
        const folder = 'uploads'; // Folder in S3 bucket
        const uploadResponse = await this.s3Service.uploadToS3(file, folder);
        return uploadResponse;
      } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new InternalServerErrorException('Error uploading file to S3');
      }
    }
}
