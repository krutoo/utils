import { useMemo, useRef, type DependencyList, type RefObject } from 'react';
import { zeroDeps } from './constants.ts';

/**
 * Returns ref that updates when some of dependency changes.
 * If deps is not provided - works like `useRef`.
 * @param initialValue Initial value in ref.
 * @param deps Dependency list.
 * @returns Ref.
 */
export function useDependentRef<T>(
  initialValue: T | null,
  deps?: DependencyList,
): RefObject<T | null>;

/**
 * Returns ref that updates when some of dependency changes.
 * If deps is not provided - works like `useRef`.
 * @param initialValue Initial value in ref.
 * @param deps Dependency list.
 * @returns Ref.
 */
export function useDependentRef<T>(
  initialValue: T | undefined,
  deps?: DependencyList,
): RefObject<T | undefined>;

/**
 * Returns ref that updates when some of dependency changes.
 * If deps is not provided - works like `useRef`.
 * @param initialValue Initial value in ref.
 * @param deps Dependency list.
 * @returns Ref.
 */
export function useDependentRef<T>(initialValue: T, deps?: DependencyList): RefObject<T> {
  const ref = useRef<T>(initialValue);

  return useMemo<RefObject<T>>(
    () => {
      return {
        get current() {
          return ref.current;
        },
        set current(value) {
          ref.current = value;
        },
      };
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps ?? zeroDeps,
  );
}
