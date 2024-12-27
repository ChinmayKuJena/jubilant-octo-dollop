import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken
import { IS_ALLOW_ANONYMOUS_KEY } from 'src/auth/allowAll.metas';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAllowAnonymous = this.reflector.get<boolean>(IS_ALLOW_ANONYMOUS_KEY, context.getHandler());

    if (isAllowAnonymous) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnauthorizedException('Token missing or malformed.');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = jwt.verify(token, '51456564156454'); 
      request.user = decodedToken;
      // console.log(decodedToken);
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
