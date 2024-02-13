import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserService } from '../users/services/users.service';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './strategy/google.strategy';
import { ProvidersModule } from '../../providers/providers.module';

@Global()
@Module({
  imports: [UsersModule, ConfigModule, ProvidersModule],
  // providers: [AuthService, UserService,],
  providers: [AuthService, UserService, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
