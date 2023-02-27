import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { MESSAGES, BEARER } from '../../../constants';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });

      req.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: MESSAGES.ACCEPT_DENIED,
        cause: error.message,
      });
    }
  }
}
