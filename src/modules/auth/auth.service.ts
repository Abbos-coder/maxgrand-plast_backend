import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { authConfig } from '../../config/auth.config';

export interface TokenPayload {
  login: string;
  issuedAt: number;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  validateCredentials(login: string, password: string): boolean {
    return login === authConfig.login && password === authConfig.password;
  }

  generateToken(): { token: string; expiresIn: number; payload: TokenPayload } {
    const issuedAt = Date.now();
    const payload: TokenPayload = {
      login: authConfig.login,
      issuedAt,
      expiresAt: issuedAt + authConfig.tokenTtlMs,
    };

    const token = this.signPayload(payload);

    return { token, expiresIn: authConfig.tokenTtlMs, payload };
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [login, issuedAtRaw, signature] = decoded.split(':');

      if (!login || !issuedAtRaw || !signature) {
        return null;
      }

      if (login !== authConfig.login) {
        return null;
      }

      const issuedAt = Number(issuedAtRaw);
      if (Number.isNaN(issuedAt)) {
        return null;
      }

      const baseString = `${login}:${issuedAt}`;
      const expectedSignature = createHmac('sha256', authConfig.tokenSecret)
        .update(baseString)
        .digest('hex');

      if (!this.signaturesEqual(expectedSignature, signature)) {
        return null;
      }

      const expiresAt = issuedAt + authConfig.tokenTtlMs;
      if (Date.now() > expiresAt) {
        return null;
      }

      return { login, issuedAt, expiresAt };
    } catch (error) {
      return null;
    }
  }

  private signPayload(payload: TokenPayload): string {
    const baseString = `${payload.login}:${payload.issuedAt}`;
    const signature = createHmac('sha256', authConfig.tokenSecret)
      .update(baseString)
      .digest('hex');

    return Buffer.from(`${baseString}:${signature}`).toString('base64');
  }

  private signaturesEqual(expected: string, received: string): boolean {
    const expectedBuffer = Buffer.from(expected);
    const receivedBuffer = Buffer.from(received);

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, receivedBuffer);
  }
}
