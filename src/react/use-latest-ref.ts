import { type MutableRefObject, useRef } from 'react';

/**
 * Returns ref that automatically actualizes current value each render.
 * Useful when you need to store actual value and pass it to effect without rerunning.
 *
 * This is a corrected implementation of "Latest Ref" pattern in React
 * that is described here: https://www.epicreact.dev/the-latest-ref-pattern-in-react.
 *
 * @param value Current value.
 * @returns Ref object.
 */
export function useLatestRef<T>(value: T): MutableRefObject<T> {
  const ref = useRef<T>(value);

  // immediately update value if it is not equals to current
  // - useEffect is not used because value must be set during render, not after render
  // - useMemo is not used to reduce amount of creating functions and arrays of deps
  if (!Object.is(ref.current, value)) {
    ref.current = value;
  }

  return ref;
}
