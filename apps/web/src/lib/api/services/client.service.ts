import { Client } from '@/lib/api';
import { Options } from 'ky';

export class ClientService {
  protected readonly client: Client;

  constructor(options: Options | ((parentOptions: Options) => Options) = {}) {
    this.client = new Client(options);
  }
}
