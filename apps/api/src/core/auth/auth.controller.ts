import { Controller, Get } from '@nestjs/common';
import { AuthenticatedUser, Resource, Scopes } from 'nest-keycloak-connect';

@Controller('auth')
@Resource('auth')
export class AuthController {
  @Get('me')
  @Scopes('profile')
  me(@AuthenticatedUser() user: any): any {
    return user;
  }
}
