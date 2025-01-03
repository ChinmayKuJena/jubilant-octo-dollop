import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';

async function bootstrap() {
  const httpsOptions = 
  null;
  //  {
  //   key: Buffer.from(process.env.PRIVATE_KEY_BASE64, 'base64').toString('utf-8'), // Path to your private key
  //   cert: Buffer.from(process.env.CERTIFICATE_BASE64, 'base64').toString('utf-8') // Path to your certificat
  //   // key: readFileSync('/home/ubuntu/jubilant-octo-dollop/key.pem'), // Path to your private key
  //   // cert: readFileSync('/home/ubuntu/jubilant-octo-dollop/cert.pem'), // Path to your certificat
  // };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.enableCors({
    origin: ['*'], // Add your UI origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(2222); // Default HTTPS port
  
}
bootstrap();
