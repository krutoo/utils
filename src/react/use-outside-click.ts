import { type RefObject } from 'react';
import { useLatestRef } from './use-latest-ref.ts';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';

/**
 * Fires callback when click is outside target element(s).
 * @param elementRef Ref (or ref list) with target element(s).
 * @param callback Callback that will be called when click is outside target elements.
 */
export function useOutsideClick<T extends Element>(
  elementRef: RefObject<T | undefined | null> | RefObject<T | undefined | null>[],
  callback?: (event: MouseEvent) => void,
): void {
  const innerRef = useLatestRef(elementRef);
  const callbackRef = useLatestRef(callback);

  useIsomorphicLayoutEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) {
        return;
      }

      const refsInit = innerRef.current;
      const refs = Array.isArray(refsInit) ? refsInit : [refsInit];

      for (const { current: element } of refs) {
        // IMPORTANT: element.contains returns true when receives himself
        if (element && element.contains(event.target)) {
          return;
        }
      }

      callbackRef.current?.(event);
    };

    const handleClickOptions = {
      capture: true,
    };

    document.documentElement.addEventListener('click', handleClick, handleClickOptions);

    return () => {
      document.documentElement.removeEventListener('click', handleClick, handleClickOptions);
    };
  }, [
    // stable:
    innerRef,
    callbackRef,
  ]);
}
