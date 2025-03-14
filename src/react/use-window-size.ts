import { useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import type { RectSize } from '../math/mod.ts';

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
 * @returns Window size object with `width` and `height` properties.
 */
export function useWindowSize(): RectSize & { ready: boolean } {
  const [state, setState] = useState<RectSize & { ready: boolean }>(() => {
    return {
      width: 0,
      height: 0,
      ready: false,
    };
  });

  useIsomorphicLayoutEffect(() => {
    const syncState = () => {
      setState({
        ready: true,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', syncState);
    window.addEventListener('orientationchange', syncState);

    syncState();

    return () => {
      window.removeEventListener('resize', syncState);
      window.removeEventListener('orientationchange', syncState);
    };
  }, []);

  return state;
}
