import { Injectable } from '@nestjs/common';
import { S3, PutObjectCommand, ListObjectsV2Command, HeadObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(private configService: ConfigService) {
    // Initialize the AWS S3 client
    this.s3 = new S3({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  // Upload file to S3
  async uploadToS3(file: Express.Multer.File, folder: string): Promise<any> {
    console.log('Uploading file to S3...');
    console.log('File path:', file.path); // Log file path
    console.log('File MIME type:', file.mimetype);  // Detect file type using MIME


    const fileContent = fs.readFileSync(file.path);

    const fileUrl = `https://${this.configService.get('AWS_S3_BUCKET')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${folder}/${file.originalname}`;
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET'), // Ensure this is properly set in your .env
      Key: `${folder}/${file.originalname}`, // S3 object key (path in the bucket)
      Body: fileContent,
      ContentType: file.mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      const uploadResponse = await this.s3.send(command);

      return { uploadResponse: uploadResponse, url: fileUrl };
    } catch (error) {
      console.error('Errror uploading to S3:', error);
      throw error;
    }
  }

  // Save file locally
  async uploadLocal(file: Express.Multer.File): Promise<string> {
    const uploadPath = path.join(__dirname, '../uploads', file.originalname);
    console.log('Saving file locally to:', uploadPath); // Log local file path

    fs.renameSync(file.path, uploadPath);
    return uploadPath;
  }

  async listBuckets() {
    const data = await this.s3.listBuckets({});
    return data.Buckets; // Return an array of buckets
  }


  async listObjectsInBucket(bucketName: string) {
    try {
      const params = {
        Bucket: bucketName, // The name of the S3 bucket
      };
      const data = await this.s3.send(new ListObjectsV2Command(params));
    
      // Generate URLs and get content type for each object
      const objectUrls = await Promise.all(
        data.Contents.map(async (object) => {
          const objectKey = object.Key;
          
          // Fetch the metadata to get ContentType
          const headParams = {
            Bucket: bucketName,
            Key: objectKey,
          };
          
          const headData = await this.s3.send(new HeadObjectCommand(headParams));
          
          // Construct the file URL
          const region = process.env.AWS_REGION; // Get region from your environment or configuration
          const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${objectKey}`;
  
          return {
            Key: objectKey,
            URL: fileUrl,
            ContentType: headData.ContentType, // Get the ContentType from the HeadObject response
            LastModified: object.LastModified, // You can keep other metadata
            Size: object.Size,
          };
        })
      );
    
      return objectUrls; // Return the object URLs with ContentType and other metadata
    } catch (error) {
      console.error('Error listing objects in bucket:', error);
      throw error;
    }
  }
  
  async deleteObject(bucketName: string, objectKey: string) {
    try {
      const params = {
        Bucket: bucketName,
        Key: objectKey,
      };
      await this.s3.send(new DeleteObjectCommand(params));
      console.log(`Object ${objectKey} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting object ${objectKey}:`, error);
      throw error;
    }
  }
  

}
