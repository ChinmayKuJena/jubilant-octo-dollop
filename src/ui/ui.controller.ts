import { Controller, Get, Res } from '@nestjs/common';
import * as path from 'path';
import { Response } from 'express';
import { AllowAnonymous } from 'src/auth/allowAll.metas';

@Controller('ui')
export class UiController {
    @Get('upload')
    // @AllowAnonymous()
    async serveHtml(@Res() res: Response) {
      const htmlFilePath = path.join(__dirname, '..', '..', 'templates', 'newTest.html');
      // const htmlFilePath = path.join('/ui', 'index.html');
      return res.sendFile(htmlFilePath); // Serve the HTML file
    }
    
    @Get('login')
    @AllowAnonymous()
    async login(@Res() res: Response) {
      const htmlFilePath = path.join(__dirname, '..', '..', 'templates', 'testUi.html');
      // const htmlFilePath = path.join('/ui', 'index.html');
      return res.sendFile(htmlFilePath); // Serve the HTML file
    }
    // @Get('login')
    // @AllowAnonymous()
    // async login(@Res() res: Response) {
    //   const htmlFilePath = path.join(__dirname, '..', '..', 'templates', 'login.html');
    //   // const htmlFilePath = path.join('/ui', 'index.html');
    //   return res.sendFile(htmlFilePath); // Serve the HTML file
    // }
    
    @Get('image')
    @AllowAnonymous()
    async imageUploader(@Res() res: Response) {
      const htmlFilePath = path.join(__dirname, '..', '..', 'templates', 'imageUpload.html');
      // const htmlFilePath = path.join('/ui', 'index.html');
      return res.sendFile(htmlFilePath); // Serve the HTML file
    }
  
}
