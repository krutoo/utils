import { useEffect, useLayoutEffect } from 'react';

// @todo export function setIsomorphicEffectEnv (env: string): void

/**
 * Isomorphic layout effect hook.
 * Uses `useEffect` on the server and `useLayoutEffect` in the browser.
 * Do not produces errors/warnings on server.
 */
export const useIsomorphicLayoutEffect: typeof useLayoutEffect =
  /*
   * explanation of condition:
   *
   * - previously there was `typeof window !== 'undefined' && !globalThis.Deno`
   *   but `globalThis` is supported not everywhere
   *   also `window` is exists in both of deno (v1) and browsers
   *
   * - first we use `typeof document` for safety check that global variable `document` exists
   *   `typeof` is needed because `Boolean(document)` can provide error "ReferenceError: document is not defined"
   *   it is because in JS strict mode we can not access to non existed variables
   *
   * - checking `document.createElement` is just to be sure that is valid document object
   */
  typeof document !== 'undefined' && document.createElement !== void 0
    ? useLayoutEffect
    : useEffect;
