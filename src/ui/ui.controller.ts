import { Controller, Get, Res } from '@nestjs/common';
import * as path from 'path';
import { Response } from 'express';

@Controller('ui')
export class UiController {
    @Get('upload')
    async serveHtml(@Res() res: Response) {
      const htmlFilePath = path.join(__dirname, '..', '..', 'templates', 'newTest.html');
      // const htmlFilePath = path.join('/ui', 'index.html');
      return res.sendFile(htmlFilePath); // Serve the HTML file
    }
  
    @Get('image')
    async imageUploader(@Res() res: Response) {
      const htmlFilePath = path.join(__dirname, '..', '..', 'templates', 'imageUpload.html');
      // const htmlFilePath = path.join('/ui', 'index.html');
      return res.sendFile(htmlFilePath); // Serve the HTML file
    }
  
}
