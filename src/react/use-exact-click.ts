// @deno-types="npm:@types/react@18"
import { type MouseEventHandler, useCallback, useRef } from 'react';

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
 * @inheritdoc
 */
export function useExactClick(
  onExactClick: MouseEventHandler | undefined,
  { onMouseDown, onMouseUp }: UseExactClickOptions = {},
): UseExactClickReturn {
  const callbackRef = useRef(onExactClick);
  const mouseDownTarget = useRef<EventTarget | null>(null);

  const handleMouseDown = useCallback<MouseEventHandler>(
    (event) => {
      onMouseDown?.(event);

      if (event.button === 0) {
        mouseDownTarget.current = event.target;
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
        event.currentTarget === mouseDownTarget.current
      ) {
        fn?.(event);
      }
    },
    [onMouseUp],
  );

  return { onMouseUp: handleMouseUp, onMouseDown: handleMouseDown };
}
