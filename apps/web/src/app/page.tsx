'use client';

import { AuthService, userManager, useUser } from '@/lib/auth';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useUser();

  useEffect(() => {
    void new AuthService().me();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <>{user?.profile.email}</>
      <button onClick={() => userManager.signinRedirect()}>sign in</button>
      <button onClick={() => userManager.signoutRedirect()}>sign out</button>
    </div>
  );
}
