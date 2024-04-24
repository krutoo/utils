// @deno-types="npm:@types/react@18"
import { useCallback, useRef } from 'react';

/**
 * Hook of stable callback.
 * Return function not changes but wraps actual callback.
 * @param callback Callback.
 * @returns Stable callback.
 */
// deno-lint-ignore no-explicit-any
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
): (...args: Parameters<T>) => ReturnType<T> {
  const ref = useRef(callback);

  ref.current = callback;

  return useCallback((...args: Parameters<T>) => ref.current(...args), []);
}
