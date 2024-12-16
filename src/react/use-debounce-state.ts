import { useEffect, useState } from 'react';

/**
 * Returns debounced state from given state.
 * @param value State value.
 * @param timeout Timeout in milliseconds.
 */
export function useDebounceState<T>(value: T, timeout: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, timeout);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, timeout]);

  return debouncedValue;
}
