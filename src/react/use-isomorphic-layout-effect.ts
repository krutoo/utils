import { useEffect, useLayoutEffect } from 'react';

// @todo export function setIsomorphicEffectEnv (env: string): void

/**
 * Isomorphic layout effect hook.
 * Do not produces errors/warnings on server.
 * Uses `useEffect` on server and `useLayoutEffect` on client.
 */
export const useIsomorphicLayoutEffect: typeof useEffect =
  typeof window !== 'undefined' && !(globalThis as unknown as { Deno: unknown }).Deno
    ? useLayoutEffect
    : useEffect;
