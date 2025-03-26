import { createParamDecorator } from '@nestjs/common';
import { Context } from '../context';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { AuthUser } from '../../../core/auth/auth-user';

export const Ctx = createParamDecorator((_, ctx) => {
  const request = ctx.switchToHttp().getRequest<Request & { user?: any }>();
  const user = plainToInstance(AuthUser, request.user);

  return new Context({ user });
});
