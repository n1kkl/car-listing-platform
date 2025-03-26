import { Log } from 'oidc-client-ts';
import { envOr } from '@/lib/config';

export function setLogLevel() {
  const level = envOr('NEXT_PUBLIC_OIDC_LOG_LEVEL', 'none').toUpperCase();
  const mapping: Record<string, Log> = {
    NONE: Log.NONE,
    ERROR: Log.ERROR,
    WARN: Log.WARN,
    INFO: Log.INFO,
    DEBUG: Log.DEBUG,
  };
  if (!(level in mapping)) {
    console.warn(
      `Invalid oidc log level ${level}. Allowed values are: ${Object.keys(mapping).join(', ')}`,
    );
    return;
  }

  Log.setLogger(console);
  Log.setLevel(mapping[level]);
}
