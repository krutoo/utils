import { type MouseEventHandler, useCallback, useRef } from 'react';
import { useLatestRef } from './use-latest-ref.ts';

/** Options of `useExactClick` hook. */
export interface UseExactClickOptions {
  /** Handler for `mousedown` event. */
  onMouseDown?: MouseEventHandler;

  /** Handler for `mouseup` event. */
  onMouseUp?: MouseEventHandler;
}

/** Return value type of `useExactClick` hook. */
export interface UseExactClickReturn {
  /** Handler for `mousedown` event. */
  onMouseDown: MouseEventHandler;

  /** Handler for `mouseup` event. */
  onMouseUp: MouseEventHandler;
}

/**
 * Calls callback when click was started and ended on same element.
 * Useful for "backdrop" elements of modal windows.
 * @param onExactClick Click event callback.
 * @param options Options.
 * @returns Props for HTMLElement.
 */
export function useExactClick(
  onExactClick: MouseEventHandler | undefined,
  { onMouseDown, onMouseUp }: UseExactClickOptions = {},
): UseExactClickReturn {
  const mouseDownTargetRef = useRef<EventTarget | null>(null);
  const callbackRef = useLatestRef(onExactClick);

  const handleMouseDown = useCallback<MouseEventHandler>(
    event => {
      onMouseDown?.(event);

      if (event.button === 0) {
        mouseDownTargetRef.current = event.target;
      }
    },
    [onMouseDown],
  );

  const handleMouseUp = useCallback<MouseEventHandler>(
    event => {
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
