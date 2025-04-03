import { Provider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { AuthUser } from '../../../core/auth/auth-user.entity';
import { I18nContext } from 'nestjs-i18n';
import { Context } from '../context';

export const ContextProvider: Provider = {
  provide: Context,
  scope: Scope.REQUEST,
  useFactory: (request: Request & { user?: any }) => {
    const user = plainToInstance(AuthUser, request.user);
    const i18n = request ? I18nContext.current() : undefined;
    const lang = i18n?.lang || 'en';

    return new Context({ user, lang });
  },
  inject: [REQUEST],
};
