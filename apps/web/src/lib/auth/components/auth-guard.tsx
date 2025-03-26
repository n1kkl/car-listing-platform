import { RolesGuard } from '@/lib/auth';
import { ReactNode } from 'react';
import { Role } from '@repo/shared-types/auth/role';

type AuthGuardProps = {
  children: ReactNode;
  redirect?: string;
};

export function AuthGuard({ children, redirect = '/' }: AuthGuardProps) {
  return (
    <RolesGuard roles={[Role.USER]} redirect={redirect}>
      {children}
    </RolesGuard>
  );
}
