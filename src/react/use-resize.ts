import { type RefObject, type MutableRefObject, useContext, useMemo } from 'react';
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
 * @param options Resize observer options.
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
  options?: ResizeObserverOptions,
): void {
  const { getObserver } = useContext(ResizeObserverContext);
  const callbackRef = useIdentityRef(callback);

  const hasOptions = useMemo(() => !!options, [options]);

  const readyOptions = useMemo(() => {
    if (!hasOptions) {
      return undefined;
    }

    return {
      box: options?.box,
    };
  }, [hasOptions, options?.box]);

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
    });

    observer.observe(element, readyOptions);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, callbackRef, getObserver, readyOptions]);
}
