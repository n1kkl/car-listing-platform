import { Controller, Get } from '@nestjs/common';
import { Resource, Scopes } from 'nest-keycloak-connect';
import { Ctx } from '../../common/global/decorators/ctx.decorator';
import { Context } from '../../common/global/context';
import { AuthUser } from './auth-user.entity';

@Controller('auth')
@Resource('auth')
export class AuthController {
  @Get('me')
  @Scopes('profile')
  me(@Ctx() ctx: Context): AuthUser {
    return ctx.user;
  }
}
