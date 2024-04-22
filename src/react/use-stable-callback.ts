import { useCallback, useRef } from 'react';

// deno-lint-ignore no-explicit-any
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
): (...args: Parameters<T>) => ReturnType<T> {
  const ref = useRef(callback);

  ref.current = callback;

  return useCallback((...args: Parameters<T>) => ref.current(...args), []);
}
