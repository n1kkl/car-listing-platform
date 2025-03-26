'use client';
import { AuthGuard, userManager } from '@/lib/auth';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <h1>Dashboard</h1>
      <button onClick={() => userManager.signoutRedirect()}>sign out</button>
    </AuthGuard>
  );
}
