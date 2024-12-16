import { useCallback, useMemo, useRef } from 'react';

/**
 * Hook of stable callback.
 * Return function not changes but wraps actual callback.
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
