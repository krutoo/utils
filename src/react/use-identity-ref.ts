// @deno-types="npm:@types/react@18"
import { type MutableRefObject, useMemo, useRef } from 'react';

/**
 * Returns ref that automatically actualizes current value.
 * @param value Current value.
 */
export function useIdentityRef<T>(value: T): MutableRefObject<T> {
  const ref = useRef<T>(value);

  // useEffect is replaced by useMemo here because we need to set actual value during render, not after render
  useMemo<void>(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
