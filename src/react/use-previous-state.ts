import { useEffect, useRef } from 'react';

export function usePreviousState<T>(actualValue: T): T | undefined;

export function usePreviousState<T, I>(actualValue: T, initialValue: I): T | I;

export function usePreviousState(actualValue: unknown, initialValue?: unknown) {
  const ref = useRef(initialValue);

  useEffect(() => {
    ref.current = actualValue;
  }, [actualValue]);

  return ref.current;
}
