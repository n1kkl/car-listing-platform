'use client';

import { useEffect } from 'react';
import { userManager } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    userManager
      .signinCallback(window.location.href)
      .then(() => router.push('/dashboard'))
      .catch((e) => {
        console.error('Failed to sign in', e);
        void router.push('/');
      });
  }, []);

  return <></>;
}
