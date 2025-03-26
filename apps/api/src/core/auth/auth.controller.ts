import { Controller, Get } from '@nestjs/common';
import { AuthenticatedUser, Resource, Scopes } from 'nest-keycloak-connect';
import { AuthUser } from './auth.types';

@Controller('auth')
@Resource('auth')
export class AuthController {
  @Get('me')
  @Scopes('profile')
  me(@AuthenticatedUser() user: AuthUser): any {
    return user;
  }
}
