import ky, { KyInstance, Options } from 'ky';
import { envOrThrow } from '@/lib/config';
import { userManager } from '@/lib/auth';

export class Client {
  private readonly ky: KyInstance;

  constructor(options: Options | ((parentOptions: Options) => Options) = {}) {
    this.ky = ky.create({
      prefixUrl: envOrThrow('NEXT_PUBLIC_API_URL'),
      hooks: {
        beforeRequest: [this.authorizationHook],
      },
    });
    this.ky.extend(options);
  }

  public get http(): KyInstance {
    return this.ky;
  }

  protected async authorizationHook(request: Request): Promise<void> {
    const user = await userManager.getUser();
    if (!user) {
      return;
    }

    const token = user.access_token;
    request.headers.set('Authorization', `Bearer ${token}`);
  }
}
