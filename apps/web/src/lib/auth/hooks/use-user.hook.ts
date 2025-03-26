import { useEffect, useState } from 'react';
import { userManager } from '@/lib/auth';
import { User } from 'oidc-client-ts';

export function useUser(): { user: User | null; isLoading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function hydrateUser() {
    userManager.getUser().then((user) => {
      setUser(user);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    hydrateUser();

    const handler = userManager.events.addUserSessionChanged(() => {
      hydrateUser();
    });

    return userManager.events.removeUserSessionChanged(handler);
  }, []);

  return { user, isLoading };
}
