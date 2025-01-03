import { type DependencyList, type RefObject, useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';

/** State of `useBoundingClientRect` hook. */
export interface DOMRectState
  extends Pick<
    DOMRectReadOnly,
    'width' | 'height' | 'x' | 'y' | 'top' | 'left' | 'bottom' | 'right'
  > {
  /** True when computed, false by default (when state is default - empty). */
  ready: boolean;
}

const DEFAULT_STATE: DOMRectState = {
  ready: false,
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

/**
 * Hook of state of bounding client rect of element.
 * @param ref Ref with element.
 * @param extraDeps Deps for force re init listeners.
 * @returns Rect state.
 */
export function useBoundingClientRect<T extends Element>(
  ref: RefObject<T>,
  extraDeps?: DependencyList,
): DOMRectState {
  const [state, setState] = useState<DOMRectState>(DEFAULT_STATE);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const rectToState = (rect: DOMRect | DOMRectReadOnly): DOMRectState => ({
      ready: true,
      width: rect.width,
      height: rect.height,
      x: rect.x,
      y: rect.y,
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
    });

    const onResize = () => {
      setState(rectToState(element.getBoundingClientRect()));
    };

    const onScroll = () => {
      const rect = element.getBoundingClientRect();

      setState(current => {
        if (rect.x !== current.x || rect.y !== current.y) {
          return rectToState(rect);
        }

        return current;
      });
    };

    const observer = new ResizeObserver(onResize);

    observer.observe(element);

    // IMPORTANT: document scroll event will be fired when any element scrolls
    // example: https://codepen.io/dmtr_ptrv/pen/QWPYGVL
    document.addEventListener('scroll', onScroll, true);

    // initial sync
    setState(rectToState(element.getBoundingClientRect()));

    return () => {
      observer.disconnect();
      document.removeEventListener('scroll', onScroll, true);
    };
  }, [ref, ...(extraDeps ?? [])]);

  return state;
}
