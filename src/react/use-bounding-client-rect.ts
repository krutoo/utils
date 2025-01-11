import { type DependencyList, type RefObject, useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';

export type DOMRectShape = Pick<
  DOMRectReadOnly,
  'width' | 'height' | 'x' | 'y' | 'top' | 'left' | 'bottom' | 'right'
>;

/** State of `useBoundingClientRect` hook. */
export interface DOMRectState extends DOMRectShape {
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

function isRectsEqual(a: DOMRectShape, b: DOMRectShape) {
  if (
    // ВАЖНО: проверяем только позицию верхнего левого угла и размеры
    // так как остальные значения зависят от позиции и размеров
    a.width !== b.width ||
    a.height !== b.height ||
    a.top !== b.top ||
    a.left !== b.left
  ) {
    return false;
  }

  return true;
}

/**
 * Hook of state of bounding client rect of element.
 * @param ref Ref with element.
 * @param extraDeps Deps for force re init listeners.
 * @returns Rect state.
 */
export function useBoundingClientRect<T extends Element>(
  ref: RefObject<T>,
  extraDeps: DependencyList = [],
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

    const onChange = () => {
      const rect = element.getBoundingClientRect();

      setState(current => {
        if (isRectsEqual(current, rect)) {
          return current;
        }

        return rectToState(rect);
      });
    };

    const observer = new ResizeObserver(onChange);

    observer.observe(element);

    // IMPORTANT: document scroll event will be fired when any element scrolls
    // example: https://codepen.io/dmtr_ptrv/pen/QWPYGVL
    document.addEventListener('scroll', onChange, true);

    // initial sync
    setState(rectToState(element.getBoundingClientRect()));

    return () => {
      observer.disconnect();
      document.removeEventListener('scroll', onChange, true);
    };
  }, [ref, ...extraDeps]);

  return state;
}
