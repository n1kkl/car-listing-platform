import { useRoles } from '@/lib/auth';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@repo/shared-types';

type RolesGuardProps = {
  roles: Role[];
  children: ReactNode;
  redirect?: string;
};

export function RolesGuard({
  roles: allowedRoles,
  children,
  redirect = '/',
}: RolesGuardProps) {
  const { roles, isLoading } = useRoles();
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!roles.some((r) => allowedRoles.includes(r))) {
      router.push(redirect);
      return;
    }

    setIsAllowed(true);
  }, [allowedRoles, roles, isLoading]);

  if (!isAllowed) {
    // todo: add loading spinner; implement prop for custom loading spinner?
    return null;
  }

  return <>{children}</>;
}
