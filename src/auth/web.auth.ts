import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken
import { IS_ALLOW_ANONYMOUS_KEY } from 'src/auth/allowAll.metas';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAllowAnonymous = this.reflector.get<boolean>(IS_ALLOW_ANONYMOUS_KEY, context.getHandler());

    // Allow anonymous access if configured
    if (isAllowAnonymous) {
      return true;
    }

    // Check if the request is for WebSocket or HTTP
    const type = context.getType(); // 'ws' for WebSocket, 'http' for HTTP

    if (type === 'ws') {
      // Handle WebSocket connections
      const client = context.switchToWs().getClient<Socket>();
      const authHeader = client.handshake.auth['token'];
      console.log('authHeader', authHeader);
      
      if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthorizedException('Token missing or malformed.WSS');
      }

      const token = authHeader.split(' ')[1];
      try {
        const decodedToken = jwt.verify(token, '51456564156454'); // Secret key
        client.data.user = decodedToken; // Attach the decoded token to the client data
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token.');
      }
    } else if (type === 'http') {
      // Handle HTTP requests
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];

      if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthorizedException('Token missing or malformed.HTTP');
      }

      const token = authHeader.split(' ')[1];
      try {
        const decodedToken = jwt.verify(token, '51456564156454'); // Secret key
        request.user = decodedToken; // Attach the decoded token to the request object
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token.');
      }
    } else {
      // For other types, reject the request
      throw new UnauthorizedException('Unsupported request type.');
    }
  }
}
