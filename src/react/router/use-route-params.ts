import { useMemo } from 'react';
import { normalizePathname } from '../../router/utils.ts';
import { useLocation } from './use-location.ts';

/**
 * Returns pathname pattern exec result on current location.
 * @param pathnamePattern Pathname pattern.
 * @returns Params.
 *
 * @example
 * ```js
 * const { userId } = useRouteParams('/user/:userId');
 * ```
 */
export function useRouteParams(pathnamePattern: string): Record<string, string | undefined> {
  const location = useLocation();

  return useMemo(() => {
    // @todo брать реализацию URLPattern из какого-нибудь контекста?
    const pattern = new URLPattern({ pathname: normalizePathname(pathnamePattern) });

    return pattern.exec({ pathname: normalizePathname(location.pathname) })?.pathname.groups ?? {};
  }, [location, pathnamePattern]);
}
