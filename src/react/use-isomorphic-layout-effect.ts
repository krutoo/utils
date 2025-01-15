import { useEffect, useLayoutEffect } from 'react';

/**
 * Isomorphic layout effect hook.
 * Do not produces errors/warnings on server.
 * Uses `useEffect` on server and `useLayoutEffect` on client.
 */
export const useIsomorphicLayoutEffect: typeof useEffect =
  typeof window !== 'undefined' && !(globalThis as unknown as { Deno: unknown }).Deno
    ? useLayoutEffect
    : useEffect;
