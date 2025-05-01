import { useRef } from 'react';

/**
 * Hook of stable callback.
 *
 * Returned function not changes when callback changes but wraps actual callback.
 * Useful when you want to use a callback in an effect,
 * but don't want the callback change to trigger the effect.
 *
 * @param callback Callback.
 * @returns Stable callback.
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
): (...args: Parameters<T>) => ReturnType<T> {
  const callbackRef = useRef(callback);
  const stableCallbackRef = useRef<((...args: Parameters<T>) => ReturnType<T>) | null>(null);

  // useEffect was replaced by useMemo here because we need to set actual value during render, not after render
  // useMemo was replaced by if(...){...} to reduce amount of creating functions and arrays of deps
  if (!Object.is(callbackRef.current, callback)) {
    callbackRef.current = callback;
  }

  // useCallback was replaced by this construction for performance reasons:
  // - reduce function creating on each render for useCallback first argument
  // - reduce array creating on each render for useCallback second argument
  if (stableCallbackRef.current === null) {
    stableCallbackRef.current = (...args: Parameters<T>) => callbackRef.current(...args);
  }

  return stableCallbackRef.current;
}
