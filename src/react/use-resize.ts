import { type RefObject, type MutableRefObject, useContext } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { useIdentityRef } from './use-identity-ref.ts';
import { ResizeObserverContext } from './context/resize-observer-context.ts';

/**
 * React hook for observe element resizing.
 *
 * @example
 * ```tsx
 * import { useResize } from '@krutoo/utils/react';
 *
 * export function App () {
 *   const ref = useRef<HTMLDivElement>(null);
 *
 *   useResize(ref, (entry) => {
 *     console.log(`Element was resized`);
 *   });
 *
 *   return <div ref={ref}>Hello!</div>;
 * }
 * ```
 *
 * @param ref Element ref.
 * @param callback Resize observer callback.
 */
export function useResize<T extends Element>(
  ref:
    | RefObject<T>
    | RefObject<T | null>
    | RefObject<T | undefined>
    | MutableRefObject<T>
    | MutableRefObject<T | null>
    | MutableRefObject<T | undefined>,
  callback: (entry: ResizeObserverEntry) => void,
): void {
  const { getObserver } = useContext(ResizeObserverContext);

  const callbackRef = useIdentityRef(callback);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === element) {
          callbackRef.current(entry);
        }
      }
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, callbackRef, getObserver]);
}
