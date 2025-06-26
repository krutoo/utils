import { type MutableRefObject, useRef } from 'react';

/**
 * Returns ref that automatically actualizes current value.
 * Useful when you need to store actual value and pass it to effect without rerunning.
 *
 * @example
 * ```tsx
 * import { useIdentityRef } from "@krutoo/utils/react";
 *
 * function App ({ count }: { count: number }) {
 *   const countRef = useIdentityRef(count);
 *
 *   // ref will always contain actual value
 *   // so you can read this ref inside effects without rerunning
 *   console.assert(count === countRef.current);
 *
 *   return <div>Count: {count}</div>;
 * }
 * ```
 *
 * @param value Current value.
 * @returns Ref object.
 */
export function useIdentityRef<T>(value: T): MutableRefObject<T> {
  const ref = useRef<T>(value);

  // immediately update value if it is not equals to current
  // - useEffect is not used because value must be set during render, not after render
  // - useMemo is not used to reduce amount of creating functions and arrays of deps
  if (!Object.is(ref.current, value)) {
    ref.current = value;
  }

  return ref;
}
