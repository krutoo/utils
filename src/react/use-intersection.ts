import { type RefObject, useContext, useMemo, useRef, type DependencyList } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { useLatestRef } from './use-latest-ref.ts';
import { IntersectionObserverContext } from './context/intersection-observer-context.ts';
import { isShallowEqual } from '../mod.ts';
import { zeroDeps } from './constants.ts';

export interface UseIntersectionOptions extends IntersectionObserverInit {
  /** Dependencies that triggers checking ref and recreating observer. */
  extraDeps?: DependencyList;
}

/**
 * Rect hook of using IntersectionObserver on element.
 * @param ref Ref with element.
 * @param callback Observer callback.
 * @param options Observe options.
 */
export function useIntersection<T extends Element>(
  ref: RefObject<T> | RefObject<T | null> | RefObject<T | undefined>,
  callback: (entry: IntersectionObserverEntry) => void,
  { extraDeps = zeroDeps, ...options }: UseIntersectionOptions = {},
): void {
  const { getObserver } = useContext(IntersectionObserverContext);

  const callbackRef = useLatestRef(callback);

  // IMPORTANT: only `hasOptions` should be in deps of `readyOptions`, not `options` itself.
  // It is because in case we add `options` to deps - it will be changed
  // on every render if options passed as inline object.
  const hasOptions = useMemo<boolean>(
    () => Boolean(options.root ?? options.rootMargin ?? options.threshold),
    [options],
  );

  // IMPORTANT: use shallow equality check only for `threshold` because it is single non primitive option
  const threshold = useShallowEqual(options?.threshold);

  // IMPORTANT: don't use shallow equality because only used (known) properties should be checked.
  // Shallow equality check will be slow/wrong if `options` object has a lot of extra properties.
  const readyOptions = useMemo<IntersectionObserverInit | undefined>(() => {
    if (!hasOptions) {
      // IMPORTANT: undefined should be returned when user pass undefined
      // for consistency and transparency of hook usage.
      return undefined;
    }

    const result: IntersectionObserverInit = {
      root: options?.root,
      rootMargin: options?.rootMargin,
      threshold,
    };

    return result;
  }, [hasOptions, options?.root, options?.rootMargin, threshold]);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = getObserver(entries => {
      for (const entry of entries) {
        if (entry.target === element) {
          callbackRef.current(entry);

          // IMPORTANT: break loop after first matching element found
          break;
        }
      }
    }, readyOptions);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [
    ref,
    readyOptions,
    getObserver,

    // stable:
    callbackRef,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...extraDeps,
  ]);
}

/**
 * Hook that updates return value when it is now shallow equal to given value.
 * @param value Value.
 * @returns Value.
 */
function useShallowEqual<T>(value: T): T {
  const ref = useRef(value);

  if (!isShallowEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}
