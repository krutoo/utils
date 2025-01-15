import { useCallback, useMemo, useRef } from 'react';

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
  const ref = useRef(callback);

  // useEffect is replaced by useMemo here because we need to set actual value during render, not after render
  useMemo(() => {
    ref.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => ref.current(...args), []);
}
