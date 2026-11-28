import { useRef } from 'react';
import { isShallowEqual } from '../misc/is-shallow-equal.ts';

/**
 * Returns the given value, updating the memoized value only when it is not shallow equal to the previous one.
 * @param value Value.
 * @returns Memoized value.
 */
export function useShallowMemo<T>(value: T): T {
  const ref = useRef(value);

  if (!isShallowEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}
