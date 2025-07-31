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
      const refOrRefs = innerRef.current;
      const refs = Array.isArray(refOrRefs) ? refOrRefs : [refOrRefs];

      let isOutside = true;

      for (const { current: element } of refs) {
        if (
          element &&
          event.target instanceof Node &&
          (element === event.target || element.contains(event.target))
        ) {
          isOutside = false;
          break;
        }
      }

      if (isOutside) {
        callbackRef.current?.(event);
      }
    };

    const handleClickOptions = {
      capture: true,
    };

    document.documentElement.addEventListener('click', handleClick, handleClickOptions);

    return () => {
      document.documentElement.removeEventListener('click', handleClick, handleClickOptions);
    };
  }, [innerRef, callbackRef]);
}
