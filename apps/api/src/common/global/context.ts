import { AuthUser } from '../../core/auth/auth-user';
import { I18nContext } from 'nestjs-i18n';
import { i18nService } from '../../main';

type ContextParams = {
  user?: AuthUser;
  i18n?: I18nContext;
};

export class Context {
  private readonly _user?: AuthUser;
  private readonly _i18n: I18nContext;

  constructor(params: ContextParams) {
    this._user = params.user;
    this._i18n =
      params.i18n ||
      I18nContext.current() ||
      new I18nContext('en', i18nService);
  }

  get user(): AuthUser | undefined {
    return this._user;
  }

  get i18n(): I18nContext {
    return this._i18n;
  }
}

export const SYSTEM_CTX = new Context({
  i18n: I18nContext.current() || new I18nContext('en', i18nService),
});
