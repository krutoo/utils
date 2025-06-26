import { useRef } from 'react';

interface HookState<T extends (...args: any[]) => any> {
  callback: T;
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
  const stateRef = useRef<HookState<T>>(null);

  // init state once
  if (stateRef.current === null) {
    const initialState: HookState<T> = {
      callback,
      stable: (...args: Parameters<T>) => initialState.callback(...args),
    };

    stateRef.current = initialState;
  }

  const state = stateRef.current;

  // immediately update callback if it is not equals to current
  // - useEffect is not used because value must be set during render, not after render
  // - useMemo is not used to reduce amount of creating functions and arrays of deps
  if (!Object.is(state.callback, callback)) {
    state.callback = callback;
  }

  return state.stable;
}
