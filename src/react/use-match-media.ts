// @deno-types="npm:@types/react@18"
import { useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';

/**
 * Hook of state of match media query.
 * @param query Query.
 * @returns Boolean.
 */
export function useMatchMedia(query: string): boolean {
  const [state, setState] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const mql = matchMedia(query);

    const syncState = () => {
      setState(mql.matches);
    };

    mql.addEventListener('change', syncState);

    syncState();

    return () => {
      mql.removeEventListener('change', syncState);
    };
  }, [query]);

  return state;
}
