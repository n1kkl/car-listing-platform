// because next needs to inline the variables when building the app
// todo: better way to do this
const variables = Object.assign(process.env, {
  NEXT_PUBLIC_OIDC_AUTHORITY: process.env.NEXT_PUBLIC_OIDC_AUTHORITY,
  NEXT_PUBLIC_OIDC_CLIENT_ID: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID,
  NEXT_PUBLIC_OIDC_REDIRECT_URI: process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI,
  NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI:
    process.env.NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

export function env(key: string): null | string {
  return variables[key] ?? null;
}

export function envOr(key: string, defaultValue: string): string {
  return variables[key] ?? defaultValue;
}

export function envOrThrow(key: string): string {
  const value = variables[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}
