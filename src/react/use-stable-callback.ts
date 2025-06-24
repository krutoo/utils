import { useRef } from 'react';

interface CallbackHolder<T extends (...args: any[]) => any> {
  actual: T;
  stable: (...args: Parameters<T>) => ReturnType<T>;
}

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
  const ref = useRef<CallbackHolder<T>>(null);

  if (ref.current === null) {
    const value = {
      actual: callback,
      stable: (...args: Parameters<T>) => value.actual(...args),
    };

    ref.current = value;
  }

  // useEffect was replaced by useMemo here because we need to set actual value during render, not after render
  // useMemo was replaced by if(...){...} to reduce amount of creating functions and arrays of deps
  if (!Object.is(callback, ref.current.actual)) {
    ref.current.actual = callback;
  }

  return ref.current.stable;
}
