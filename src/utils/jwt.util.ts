import { Injectable } from '@nestjs/common';
import { sign, SignOptions } from 'jsonwebtoken';

@Injectable()
export class JwtUtil {
  private static secretKey: string = '51456564156454'; // Use env for security

  /**
   * Generates a JWT token
   * @param claims - The payload/claims for the JWT
   * @param expiresIn - Expiration time in seconds or string (e.g., '1h')
   * @returns The generated JWT token
   */
  static generateToken(
    claims: Record<string, any>,
    expiresIn: string | number,
  ): string {
    const options: SignOptions = {
      expiresIn,
    };

    return sign(claims, this.secretKey, options);
  }
}
