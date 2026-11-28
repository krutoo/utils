import { type DependencyList, type RefObject, useContext, useMemo } from 'react';
import { zeroDeps } from '../constants.ts';
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect.ts';
import { useLatestRef } from '../use-latest-ref.ts';
import { ResizeObserverContext } from './resize-observer-context.ts';

export interface UseResizeOptions extends ResizeObserverOptions {
  /** When `true`, observation is disabled. */
  disabled?: boolean;

  /** Dependencies that triggers checking ref and recreating observer. */
  extraDeps?: DependencyList;
}

/**
 * React hook for observe element resizing.
 * @param ref Element ref.
 * @param callback Resize observer callback.
 * @param options Resize observer options.
 */
export function useResize<T extends Element>(
  ref: RefObject<T> | RefObject<T | null> | RefObject<T | undefined>,
  callback: (entry: ResizeObserverEntry) => void,
  { extraDeps = zeroDeps, disabled, box: boxProp }: UseResizeOptions = {},
): void {
  const { getObserver } = useContext(ResizeObserverContext);
  const callbackRef = useLatestRef(callback);

  // IMPORTANT: only used option fields should be in deps of `readyOptions`, not `options` itself.
  // An inline options object would be recreated on every render.
  const hasOptions: boolean = boxProp !== undefined;

  // IMPORTANT: don't use shallow equality because only used properties should be checked.
  // Shallow equality check will be slow/wrong if `options` object has a lot of extra properties.
  const readyOptions = useMemo(() => {
    if (!hasOptions) {
      // IMPORTANT: undefined should be returned when user pass undefined
      // for consistency and transparency of hook usage.
      return undefined;
    }

    return {
      box: boxProp,
    };
  }, [hasOptions, boxProp]);

  useIsomorphicLayoutEffect(() => {
    if (disabled) {
      return;
    }

    const element = ref.current;

    if (!element) {
      return;
    }

    // IMPORTANT: callback will not be called synchronously,
    // so it can be possibly called after effect destructured.
    // To avoid React errors, effect activity flag used.
    let active = true;

    const observer = getObserver(entries => {
      if (!active) {
        return;
      }

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
      active = false;
      observer.unobserve(element);
    };
  }, [
    ref,
    disabled,
    getObserver,
    readyOptions,

    // stable:
    callbackRef,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...extraDeps,
  ]);
}
