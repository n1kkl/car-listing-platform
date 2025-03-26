import { useEffect, useState } from 'react';
import { userManager } from '@/lib/auth';
import { User } from 'oidc-client-ts';

export function useUser(): { user: User | null; isLoaded: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  function hydrateUser() {
    userManager.getUser().then((user) => {
      setUser(user);
      setIsLoaded(true);
    });
  }

  useEffect(() => {
    hydrateUser();

    const handler = userManager.events.addUserSessionChanged(() => {
      hydrateUser();
    });

    return userManager.events.removeUserSessionChanged(handler);
  }, []);

  return { user, isLoaded };
}
