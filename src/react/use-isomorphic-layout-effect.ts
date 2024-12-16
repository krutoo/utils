import { useEffect, useLayoutEffect } from 'react';

/**
 * Isomorphic layout effect hook.
 * Uses useEffect on server and useLayoutEffect on client.
 */
export const useIsomorphicLayoutEffect: typeof useEffect =
  typeof window !== 'undefined' && !(globalThis as unknown as { Deno: unknown }).Deno
    ? useLayoutEffect
    : useEffect;
