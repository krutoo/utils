import { type DependencyList, type RefObject, useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';

export interface DOMRectState extends
  Pick<
    DOMRectReadOnly,
    'width' | 'height' | 'x' | 'y' | 'top' | 'left' | 'bottom' | 'right'
  > {
  ready: boolean;
}

const BOUNDING_CLIENT_RECT_DEFAULT_STATE: DOMRectState = {
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

export function useBoundingClientRect<T extends HTMLElement>(
  ref: RefObject<T>,
  extraDeps?: DependencyList,
): DOMRectState {
  const [state, setState] = useState<DOMRectState>(
    BOUNDING_CLIENT_RECT_DEFAULT_STATE,
  );

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const sync = () => {
      const rect = element.getBoundingClientRect();

      setState({
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
    };

    const observer = new ResizeObserver(sync);

    sync();

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, ...(extraDeps ?? [])]);

  return state;
}
