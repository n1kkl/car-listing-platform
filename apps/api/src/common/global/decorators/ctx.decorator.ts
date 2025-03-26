import { createParamDecorator } from '@nestjs/common';
import { Context } from '../context';
import { AuthUser } from '../../../core/auth/auth.types';
import { Request } from 'express';

export const Ctx = createParamDecorator((_, ctx) => {
  const request = ctx
    .switchToHttp()
    .getRequest<Request & { user?: AuthUser }>();
  const user = request.user;

  return new Context({ user });
});
