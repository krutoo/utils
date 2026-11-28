import { type DependencyList, type RefObject, useContext, useMemo } from 'react';
import { zeroDeps } from '../constants.ts';
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect.ts';
import { useLatestRef } from '../use-latest-ref.ts';
import { useShallowMemo } from '../use-shallow-memo.ts';
import { IntersectionObserverContext } from './intersection-observer-context.ts';

export interface UseIntersectionOptions extends IntersectionObserverInit {
  /** When `true`, observation is disabled. */
  disabled?: boolean;

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
  {
    extraDeps = zeroDeps,
    disabled,
    root,
    rootMargin,
    threshold: thresholdProp,
  }: UseIntersectionOptions = {},
): void {
  const { getObserver } = useContext(IntersectionObserverContext);

  const callbackRef = useLatestRef(callback);

  // IMPORTANT: only used option fields should be in deps of `readyOptions`, not the whole options object.
  // An inline options object would be recreated on every render.
  const hasOptions: boolean = (root ?? rootMargin ?? thresholdProp) !== undefined;

  // IMPORTANT: use shallow equality check only for `threshold` because it is single non primitive option
  const threshold = useShallowMemo(thresholdProp);

  // IMPORTANT: don't use shallow equality because only used (known) properties should be checked.
  // Shallow equality check will be slow/wrong if `options` object has a lot of extra properties.
  const readyOptions = useMemo<IntersectionObserverInit | undefined>(() => {
    if (!hasOptions) {
      // IMPORTANT: undefined should be returned when user pass undefined
      // for consistency and transparency of hook usage.
      return undefined;
    }

    const result: IntersectionObserverInit = {
      root,
      rootMargin,
      threshold,
    };

    return result;
  }, [hasOptions, root, rootMargin, threshold]);

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
    }, readyOptions);

    observer.observe(element);

    return () => {
      active = false;
      observer.unobserve(element);
    };
  }, [
    ref,
    disabled,
    readyOptions,
    getObserver,

    // stable:
    callbackRef,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...extraDeps,
  ]);
}
