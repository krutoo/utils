// @deno-types="npm:@types/react@18"
import { type MutableRefObject, useMemo, useRef } from 'react';

/**
 * Returns ref that automatically actualizes current value.
 * Useful when you need to store actual value.
 * @param value Current value.
 * @example
 * ```tsx
 * import { useIdentityRef } from "@krutoo/utils/react";
 *
 * function App ({ count }: { count: number }) {
 *   const countRef = useIdentityRef(count);
 *
 *   // ref will always contain actual value
 *   console.assert(count, countRef.current)
 *
 *   return <div>Count: {count}</div>
 * }
 * ```
 */
export function useIdentityRef<T>(value: T): MutableRefObject<T> {
  const ref = useRef<T>(value);

  // useEffect is replaced by useMemo here because we need to set actual value during render, not after render
  useMemo<void>(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
