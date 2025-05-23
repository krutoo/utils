import { useState } from 'react';
import type { RectSize } from '../math/mod.ts';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { useIdentityRef } from './use-identity-ref.ts';
import { useStableCallback } from './use-stable-callback.ts';
import { noop } from '../misc/noop.ts';

export interface RectSizeWithReady extends RectSize {
  ready: boolean;
}

export interface UseWindowSizeOptions {
  /**
   * Mode of how hook will be work.
   *
   * Possible values:
   * - `stateful` (default) - hook will update returned state and cause rerender.
   * - `stateless` - hook will not update returned state.
   *
   * If you can observe window size without re-renders
   * you can provide `mode: 'stateless'` and also `onChange` to listen changes.
   */
  mode?: 'stateful' | 'stateless';

  /**
   * Will be called each time window size changes.
   * Also will be called once during listening initialization.
   */
  onChange?: (state: RectSize) => void;

  /** Initial returned state. Used before subscription effect applied. */
  defaultState?: RectSizeWithReady | (() => RectSizeWithReady);
}

/**
 * Returns default state for `useWindowSize` hook.
 * @returns Default state.
 */
function getInitialState(): RectSizeWithReady {
  return {
    ready: false,
    width: 0,
    height: 0,
  };
}

/**
 * Hook of actual state of window width and height.
 * Uses `window.innerWidth` and `window.innerHeight`.
 *
 * Alternatively you can use useVisualViewport "width" and "height" multiplied by "scale".
 *
 * @example
 * ```tsx
 * import { useWindowSize } from '@krutoo/utils/react';
 *
 * export function App() {
 *   const size = useWindowSize();
 *
 *   return (
 *     <p>
 *       Your window size is {size.width} x {size.height}px
 *     </p>
 *   );
 * }
 * ```
 *
 * @param options Options.
 * @returns Window size object with `width` and `height` properties.
 */
export function useWindowSize({
  mode = 'stateful',
  onChange = noop,
  defaultState = getInitialState,
}: UseWindowSizeOptions = {}): RectSizeWithReady {
  const [state, setState] = useState<RectSizeWithReady>(defaultState);
  const modeRef = useIdentityRef(mode);
  const handleChange = useStableCallback(onChange);

  useIsomorphicLayoutEffect(() => {
    const syncState = () => {
      const actualState = {
        ready: true,
        width: window.innerWidth,
        height: window.innerHeight,
      };

      if (modeRef.current === 'stateful') {
        setState(actualState);
      }

      handleChange(actualState);
    };

    window.addEventListener('resize', syncState);
    window.addEventListener('orientationchange', syncState);

    syncState();

    return () => {
      window.removeEventListener('resize', syncState);
      window.removeEventListener('orientationchange', syncState);
    };
  }, [modeRef, handleChange]);

  return state;
}
