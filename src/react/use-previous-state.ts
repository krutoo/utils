import { useEffect, useRef } from 'react';

export function usePreviousState<T>(actualValue: T): T | undefined;

export function usePreviousState<T, I>(actualValue: T, initialValue: I): T | I;

/**
 * Hook of previous state of a value.
 * @param actualValue Actual value.
 * @param initialValue Initial value.
 * @returns Previous value or initial value (if present) or undefined (only first time).
 */
export function usePreviousState(actualValue: unknown, initialValue?: unknown) {
  const ref = useRef(initialValue);

  useEffect(() => {
    ref.current = actualValue;
  }, [actualValue]);

  return ref.current;
}
