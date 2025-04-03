import { AuthUser } from '../../core/auth/auth-user.entity';
import { ForbiddenException } from '@nestjs/common';

type ContextParams = {
  user?: AuthUser;
  lang?: string;
};

export class Context {
  private readonly _user?: AuthUser;
  private readonly _lang: string;

  constructor(params: ContextParams) {
    this._user = params.user;
    this._lang = params.lang;
  }

  get user(): AuthUser | undefined {
    return this._user;
  }

  get lang(): string {
    return this._lang;
  }

  getUserOrThrow(): AuthUser {
    if (!this._user) {
      throw new ForbiddenException();
    }
    return this._user;
  }
}

export const SYSTEM_CTX = new Context({
  lang: 'en',
});
