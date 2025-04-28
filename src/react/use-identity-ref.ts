import { type DependencyList, type MutableRefObject, useMemo, useRef } from 'react';

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
 * @param deps Deps. Works exactly like in useEffect.
 * @returns Ref object.
 */
export function useIdentityRef<T>(value: T, deps: DependencyList = []): MutableRefObject<T> {
  const ref = useRef<T>(value);

  // useEffect is replaced by useMemo here because we need to set actual value during render, not after render
  useMemo<void>(() => {
    ref.current = value;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, ...deps]);

  return ref;
}
