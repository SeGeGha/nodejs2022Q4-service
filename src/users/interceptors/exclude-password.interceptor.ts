import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../entities/user.entity';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: User | User[] | undefined) => {
        if (!data) return;

        const users = Array.isArray(data) ? data : [data];
        const result = users.map((user) => {
          const { password, ...userData } = user;

          return userData;
        });

        return Array.isArray(data) ? result : result[0];
      }),
    );
  }
}
