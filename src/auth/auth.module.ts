import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AuthController],
  imports: [UsersModule, JwtModule.register({})],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
