import {
  type DependencyList,
  type MutableRefObject,
  type RefObject,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.ts';
import { ResizeObserverContext } from './context/resize-observer-context.ts';
import { zeroDeps } from './constants.ts';

export type DOMRectShape = Pick<
  DOMRectReadOnly,
  'width' | 'height' | 'x' | 'y' | 'top' | 'left' | 'bottom' | 'right'
>;

/** State of `useBoundingClientRect` hook. */
export interface DOMRectState extends DOMRectShape {
  /** True when computed, false by default (when state is default - empty). */
  ready: boolean;
}

export interface UseBoundingClientRectReturn extends DOMRectState {
  /** Forces calculating actual state of rectangle and update state if not equals. */
  forceUpdate: () => void;

  /** Returns plain object only with dimensions (no methods). */
  toJSON: () => DOMRectState;
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
 * Checks that two rectangles are equal by its dimensions and positions.
 * @param a First rectangle.
 * @param b Second rectangle.
 * @returns True if rects are equal, false otherwise.
 */
function isRectsEqual(a: DOMRectShape, b: DOMRectShape): boolean {
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
 * Return state from given DOMRect.
 * @param rect DOMRect or DOMRectReadOnly.
 * @returns State.
 */
function rectToState(rect: DOMRect | DOMRectReadOnly): DOMRectState {
  return {
    ready: true,
    width: rect.width,
    height: rect.height,
    x: rect.x,
    y: rect.y,
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom,
    right: rect.right,
  };
}

/**
 * React hook of state of bounding client rect of element.
 * Size and position are observed.
 *
 * @example
 * ```tsx
 * import { useBoundingClientRect } from '@krutoo/utils/react';
 *
 * export function App () {
 *   const ref = useRef<HTMLDivElement>(null);
 *
 *   // you can use bounds rectangle of element
 *   const rect = useBoundingClientRect(ref);
 *
 *   return <div ref={ref}>Hello!</div>;
 * }
 * ```
 *
 * @param ref Ref with element.
 * @param extraDeps Deps for force re init listeners.
 * @returns Rect state.
 */
export function useBoundingClientRect<T extends Element>(
  ref:
    | RefObject<T>
    | RefObject<T | null>
    | RefObject<T | undefined>
    | MutableRefObject<T>
    | MutableRefObject<T | null>
    | MutableRefObject<T | undefined>,
  extraDeps: DependencyList = zeroDeps,
): UseBoundingClientRectReturn {
  const [state, setState] = useState<DOMRectState>(DEFAULT_STATE);

  const { getObserver } = useContext(ResizeObserverContext);

  const updateState = useCallback(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();

    setState(current => {
      if (isRectsEqual(current, rect)) {
        return current;
      }

      return rectToState(rect);
    });
  }, [ref]);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = getObserver(updateState);

    observer.observe(element);

    // IMPORTANT: document scroll event will be fired when any element scrolls
    // example: https://codepen.io/dmtr_ptrv/pen/QWPYGVL
    document.addEventListener('scroll', updateState, true);

    // initial sync
    setState(rectToState(element.getBoundingClientRect()));

    return () => {
      observer.unobserve(element);
      document.removeEventListener('scroll', updateState, true);
    };
  }, [
    ref,
    getObserver,
    updateState,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...extraDeps,
  ]);

  return useMemo<UseBoundingClientRectReturn>(
    () => ({
      ...state,
      forceUpdate: updateState,
      toJSON: () => state,
    }),
    [state, updateState],
  );
}
