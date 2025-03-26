import { Role } from '@repo/shared-types';

export type AuthUser = {
  scope: string;
  roles: Array<Role | string>;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  email_verified: boolean;
};
