// @deno-types="npm:@types/react@18"
import { useEffect, useLayoutEffect } from 'react';

/**
 * Isomorphic layout effect hook.
 * Uses useEffect on server and useLayoutEffect on client.
 */
export const useIsomorphicLayoutEffect: typeof useEffect =
  // deno-lint-ignore no-explicit-any
  typeof window !== 'undefined' && !(globalThis as any).Deno ? useLayoutEffect : useEffect;
