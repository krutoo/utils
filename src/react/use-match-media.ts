import { useContext, useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { MatchMediaContext } from './context/match-media-context.ts';
import { useStableCallback } from './use-stable-callback.ts';
import { useLatestRef } from './use-latest-ref.ts';
import { noop } from '../misc/noop.ts';

export interface UseMatchMediaOptions {
  /**
   * Mode of how hook will be work.
   *
   * Possible values:
   * - `stateful` (default) - hook will update returned state and cause rerender.
   * - `stateless` - hook will not update returned state.
   *
   * If you can observe media query list without re-renders
   * you can set `mode: 'stateless'` and also `onChange` to listen changes.
   */
  mode?: 'stateful' | 'stateless';

  /**
   * Will be called each time media query list changes.
   * Also will be called once during listening initialization.
   */
  onChange?: (mql: MediaQueryList) => void;

  /**
   * Initial returned state. Used before subscription effect applied.
   */
  defaultState?: boolean | (() => boolean);
}

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
 * @param options Options.
 * @returns Boolean.
 */
export function useMatchMedia(
  query: string,
  { mode = 'stateful', onChange = noop, defaultState = false }: UseMatchMediaOptions = {},
): boolean {
  const { matchMedia } = useContext(MatchMediaContext);
  const [state, setState] = useState(defaultState);

  const modeRef = useLatestRef(mode);
  const handleChange = useStableCallback(onChange);

  useIsomorphicLayoutEffect(() => {
    const mql = matchMedia(query);

    const sync = () => {
      if (modeRef.current === 'stateful') {
        setState(mql.matches);
      }

      handleChange(mql);
    };

    sync();

    mql.addEventListener('change', sync);

    return () => {
      mql.removeEventListener('change', sync);
    };
  }, [
    query,
    matchMedia,

    // stable
    modeRef,
    handleChange,
  ]);

  return state;
}
