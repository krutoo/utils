// @deno-types="npm:@types/react@18"
import { type MouseEventHandler, useCallback, useRef } from 'react';
import { useIdentityRef } from './use-identity-ref.ts';

export interface UseExactClickOptions {
  onMouseDown?: MouseEventHandler;
  onMouseUp?: MouseEventHandler;
}

export interface UseExactClickReturn {
  onMouseDown: MouseEventHandler;
  onMouseUp: MouseEventHandler;
}

/**
 * Calls callback when click was started and ended on same element.
 * Useful for "backdrop" elements of modal windows.
 * @param onExactClick Click event callback.
 * @param options Options.
 */
export function useExactClick(
  onExactClick: MouseEventHandler | undefined,
  { onMouseDown, onMouseUp }: UseExactClickOptions = {},
): UseExactClickReturn {
  const mouseDownTargetRef = useRef<EventTarget | null>(null);
  const callbackRef = useIdentityRef(onExactClick);

  const handleMouseDown = useCallback<MouseEventHandler>(
    (event) => {
      onMouseDown?.(event);

      if (event.button === 0) {
        mouseDownTargetRef.current = event.target;
      }
    },
    [onMouseDown],
  );

  const handleMouseUp = useCallback<MouseEventHandler>(
    (event) => {
      onMouseUp?.(event);

      const fn = callbackRef.current;

      if (
        event.target === event.currentTarget &&
        event.currentTarget === mouseDownTargetRef.current
      ) {
        mouseDownTargetRef.current = null;
        fn?.(event);
      }
    },
    [onMouseUp, callbackRef],
  );

  return {
    onMouseUp: handleMouseUp,
    onMouseDown: handleMouseDown,
  };
}
