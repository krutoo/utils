import { useState, useEffect } from 'react';
import { zeroDeps } from './constants.ts';

// @todo если будет необходимо - сделать опции включая:
// - controller: для управления состоянием
// - layoutEffect: для использования useIsomorphicLayoutEffect

/**
 * Returns `true` after component is mounted (on client side), `false` otherwise.
 * @returns Boolean value.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(
    () => {
      setMounted(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    zeroDeps,
  );

  return mounted;
}
