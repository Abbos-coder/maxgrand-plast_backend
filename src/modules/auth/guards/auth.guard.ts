import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PUBLIC_ROUTE_KEY } from '../../../common/decorators/public.decorator';
import { AuthService } from '../auth.service';

const PROTECTED_METHODS = ['POST', 'PATCH', 'DELETE'];

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const method = (request.method || '').toUpperCase();

    if (!PROTECTED_METHODS.includes(method)) {
      return true;
    }

    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader || Array.isArray(authorizationHeader)) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Authorization header must be in the format: Bearer <token>');
    }

    const payload = this.authService.verifyToken(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    (request as any).user = payload;
    return true;
  }
}
