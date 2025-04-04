import { useContext, useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { MatchMediaContext } from './context/match-media-context.ts';

/**
 * Hook of state of match media query.
 *
 * @example
 * ```tsx
 * import { useMatchMedia } from '@krutoo/utils/react';
 *
 * function App () {
 *   const mobile = useMatchMedia('(max-width: 1024px)');
 *
 *   if (mobile) {
 *     return <div>Mobile site</div>;
 *   }
 *
 *   return <div>desktop site</div>;
 * }
 * ```
 *
 * @param query Query.
 * @returns Boolean.
 */
export function useMatchMedia(query: string): boolean {
  const { matchMedia } = useContext(MatchMediaContext);

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
  }, [query, matchMedia]);

  return state;
}
