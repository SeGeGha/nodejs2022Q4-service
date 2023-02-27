import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { MESSAGES, BEARER, IS_PUBLIC_KEY } from '../../../constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req.headers.authorization;
      const [bearer, token] = (authHeader && authHeader.split(' ')) || [];

      if (bearer !== BEARER || !token) {
        throw new UnauthorizedException({
          message:
            MESSAGES.AUTH_HEADER_EXCEPTION + `: authHeader - ${authHeader}`,
        });
      }

      const user = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      req.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: MESSAGES.UNAUTHORIZED_USER,
        cause: error.message,
      });
    }
  }
}
