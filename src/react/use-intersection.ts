import { type RefObject, type MutableRefObject, useContext } from 'react';
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
  const optionsRef = useIdentityRef(options);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = getObserver(entries => {
      for (const entry of entries) {
        if (entry.target === element) {
          callbackRef.current(entry);
        }
      }
    }, optionsRef.current);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, callbackRef, optionsRef, getObserver]);
}
