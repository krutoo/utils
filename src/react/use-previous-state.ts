// @deno-types="npm:@types/react@18"
import { useEffect, useRef } from 'react';

/**
 * Hook of previous state of a value.
 * @param actualValue Actual value.
 * @returns Previous value or initial value (if present) or undefined (only first time).
 */
export function usePreviousState<T>(actualValue: T): T | undefined;

/**
 * Hook of previous state of a value.
 * @param actualValue Actual value.
 * @param initialValue Initial value.
 * @returns Previous value or initial value (if present) or undefined (only first time).
 */
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
