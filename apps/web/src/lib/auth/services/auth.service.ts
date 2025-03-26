import { User } from 'oidc-client-ts';
import { ClientService } from '@/lib/api';

export class AuthService extends ClientService {
  async me(): Promise<User> {
    return this.client.http.get('auth/me').json();
  }
}
