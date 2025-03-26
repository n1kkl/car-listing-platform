import { AuthUser } from '../../core/auth/auth.types';

type ContextParams = {
  user?: AuthUser;
};

export class Context {
  constructor(private readonly params: ContextParams) {}

  get user(): AuthUser | undefined {
    return this.params.user;
  }
}

export const DEFAULT_CTX = new Context({});
