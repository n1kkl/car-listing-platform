'use client';

import { useEffect } from 'react';
import { userManager } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    userManager
      .signoutCallback(window.location.href)
      .then(() => router.push('/'))
      .catch((e) => {
        console.error('Failed to sign out', e);
        void router.push('/');
      });
  }, []);

  return <></>;
}
