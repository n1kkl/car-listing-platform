import { useUser } from '@/lib/auth';
import { Role } from '@repo/shared-types';
import { useEffect, useState } from 'react';

export function useRoles(): { roles: Role[]; isLoaded: boolean } {
  const { user, isLoaded } = useUser();
  const [roles, setRoles] = useState<Role[]>([]);

  function loadRoles(): void {
    if (!user) {
      setRoles([]);
      return;
    }

    if (!('roles' in user.profile) || !Array.isArray(user.profile.roles)) {
      console.warn(
        'User profile does not contain valid roles array',
        user.profile.roles,
      );
      setRoles([]);
      return;
    }

    const availableRoles = Object.values(Role);
    const [validRoles, invalidRoles] = user.profile.roles.reduce(
      (acc, role) => {
        if (availableRoles.includes(role)) {
          acc[0].push(role);
        } else {
          acc[1].push(role);
        }
        return acc;
      },
      [[], []] as [Role[], string[]],
    );
    if (invalidRoles.length) {
      console.warn(
        'User profile contains unknown roles',
        invalidRoles,
        'valid roles are',
        availableRoles,
      );
    }

    setRoles(validRoles);
  }

  useEffect(() => {
    loadRoles();
  }, [user]);

  return { roles, isLoaded };
}
