import { type RefObject, type MutableRefObject, useContext, useMemo } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { useLatestRef } from './use-latest-ref.ts';
import { ResizeObserverContext } from './context/resize-observer-context.ts';

/**
 * React hook for observe element resizing.
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
  const callbackRef = useLatestRef(callback);

  // IMPORTANT: only `hasOptions` should be in deps of `readyOptions`, not `options` itself.
  // It is because in case we add `options` to deps - it will be changed
  // on every render if options passed as inline object.
  const hasOptions = useMemo(() => !!options, [options]);

  // IMPORTANT: don't use shallow equality because only used properties should be checked.
  // Shallow equality check will be slow/wrong if `options` object has a lot of extra properties.
  const readyOptions = useMemo(() => {
    if (!hasOptions) {
      // IMPORTANT: undefined should be returned when user pass undefined
      // for consistency and transparency of hook usage.
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
