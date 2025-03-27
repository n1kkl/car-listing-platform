import { createParamDecorator } from '@nestjs/common';
import { Context } from '../context';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { AuthUser } from '../../../core/auth/auth-user';
import { I18nContext } from 'nestjs-i18n';

export const Ctx = createParamDecorator((_, ctx) => {
  const request = ctx.switchToHttp().getRequest<Request & { user?: any }>();
  const user = plainToInstance(AuthUser, request.user);
  const i18n = request ? I18nContext.current(ctx) : undefined;

  return new Context({ user, i18n });
});
