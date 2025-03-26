import { Role } from '@repo/shared-types';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthUser {
  @Expose()
  scope: string;
  @Expose()
  roles: Array<Role | string>;
  @Expose()
  name: string;
  @Expose()
  preferred_username: string;
  @Expose()
  given_name: string;
  @Expose()
  family_name: string;
  @Expose()
  email: string;
  @Expose()
  email_verified: boolean;
}
