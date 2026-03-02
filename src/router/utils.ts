import type { RouterLocation } from './types.ts';

/**
 * Returns stub location.
 * @returns Location.
 * @internal
 */
export function getStubLocation(): RouterLocation {
  return {
    pathname: '/',
    hash: '',
    search: '',
  };
}

/**
 * Normalizes pathname in location or URL object.
 * Does not mutate given object, returns new object.
 * @param location Location (or URL object).
 * @returns Location.
 * @internal
 */
export function normalizeLocation(location: RouterLocation): RouterLocation {
  return {
    pathname: normalizePathname(location.pathname),
    hash: location.hash,
    search: location.search,
  };
}

/**
 * Normalizes pathname.
 * @param pathname Pathname.
 * @returns Normalized pathname.
 * @internal
 */
export function normalizePathname(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}
