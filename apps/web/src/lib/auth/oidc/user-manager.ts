import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { envOrThrow } from '@/lib/config';

export const userManager = new UserManager({
  authority: envOrThrow('NEXT_PUBLIC_OIDC_AUTHORITY'),
  client_id: envOrThrow('NEXT_PUBLIC_OIDC_CLIENT_ID'),
  redirect_uri: envOrThrow('NEXT_PUBLIC_OIDC_REDIRECT_URI'),
  response_type: 'code',
  scope: 'openid profile email',
  post_logout_redirect_uri: envOrThrow(
    'NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI',
  ),
  userStore:
    typeof window === 'object' && 'localStorage' in window
      ? new WebStorageStateStore({
          store: window.localStorage,
        })
      : undefined,
});

userManager.events.addAccessTokenExpiring(() => {
  // TODO: refresh token
  console.warn('Access token expiring. Not implemented yet.');
});
