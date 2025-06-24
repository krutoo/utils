import { type RefObject, type MutableRefObject, useContext, useMemo } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { useIdentityRef } from './use-identity-ref.ts';
import { IntersectionObserverContext } from './context/intersection-observer-context.ts';

/**
 * Rect hook of using IntersectionObserver on element.
 *
 * @example
 * ```tsx
 * import { useIntersection } from '@krutoo/utils/react';
 *
 * export function App () {
 *   const ref = useRef<HTMLDivElement>(null);
 *
 *   useIntersection(ref, (entry) => {
 *     console.log(entry.isIntersecting ? 'On screen' : 'Off screen');
 *   });
 *
 *   return <div ref={ref}>Hello!</div>;
 * }
 * ```
 *
 * #### Important
 *
 * Each known option' changing will provide recreating observer.
 * In case you have `threshold` as array - provide stable array (constant or memoized).
 * Otherwise hook will be recreate observer on each render.
 *
 * Wrong:
 * ```jsx
 * // Each render hook will take new array, so this options is "unstable"
 * useIntersection(ref, callback, { threshold: [0.1, 0.2, 0.3] });
 * ```
 *
 * Right
 * ```jsx
 * // We memoize array, so it is "stable"
 * const threshold = useMemo(() => [0.1, 0.2, 0.3], []);
 * useIntersection(ref, callback, { threshold });
 * ```
 *
 * Also right:
 * ```jsx
 * // We use constant outside component, so it is "stable"
 * const THRESHOLD = [0.1, 0.2, 0.3]
 *
 * function App () {
 *   // ...
 *
 *   useIntersection(ref, callback, { threshold: THRESHOLD });
 *
 *   // ...
 * }
 * ```
 *
 * @param ref Ref with element.
 * @param callback Observer callback.
 * @param options Observe options.
 */
export function useIntersection<T extends Element>(
  ref:
    | RefObject<T>
    | RefObject<T | null>
    | RefObject<T | undefined>
    | MutableRefObject<T>
    | MutableRefObject<T | null>
    | MutableRefObject<T | undefined>,
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit,
): void {
  const { getObserver } = useContext(IntersectionObserverContext);

  const callbackRef = useIdentityRef(callback);

  // IMPORTANT: only `hasOptions` should be in deps of `readyOptions`, not `options` itself.
  // It is because in case we add `options` to deps - it will be changed
  // on every render if options passed as inline object.
  const hasOptions = useMemo(() => options !== undefined, [options]);

  // IMPORTANT: don't use shallow equality because only used properties should be checked.
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
      threshold: options?.threshold,
    };

    return result;
  }, [hasOptions, options?.root, options?.rootMargin, options?.threshold]);

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
  }, [ref, callbackRef, readyOptions, getObserver]);
}
