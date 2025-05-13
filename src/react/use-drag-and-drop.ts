import { type RefObject, type DependencyList, type MutableRefObject, useMemo } from 'react';
import { type Point2d, Vector2 } from '../math/mod.ts';
import { getPositionedParentOffset } from '../dom/mod.ts';
import { useIsomorphicLayoutEffect } from '../react/use-isomorphic-layout-effect.ts';
import { useStableCallback } from '../react/use-stable-callback.ts';
import { zeroDeps } from './constants.ts';

export interface DnDEventHandler {
  (event: { offset: Point2d; clientPosition: Point2d }): void;
}

export interface UseDragAndDropOptions {
  /** Positioning strategy. Should be same that css `position` property of target element. */
  strategy?: 'fixed' | 'absolute';

  /** When true, Drag-And-Drop will be disabled. */
  disabled?: boolean;

  /** Will be called when element is grabbed. */
  onGrab?: DnDEventHandler;

  /** Will be called when element is dragging. */
  onMove?: DnDEventHandler;

  /** Will be called when element is dropped. */
  onDrop?: DnDEventHandler;

  /** Extra deps for useEffect hook. */
  extraDeps?: DependencyList;

  needPreventTouchEvent?: (event: TouchEvent) => boolean;
}

export interface UseDragAndDropReturn {
  captured: boolean;
  offset: Point2d;
}

/**
 * Initial state factory for useDragAndDrop hook.
 * @returns State.
 */
function getInitialState() {
  return {
    captured: false,
    offset: Vector2.of(0, 0),
    innerOffset: Vector2.of(0, 0),
  };
}

/**
 * Default value for `needPreventTouchEvent` option of `UseDragAndDropOptions`.
 * @param event Event.
 * @returns Boolean.
 */
function canStartDrag(event: TouchEvent | PointerEvent | MouseEvent): boolean {
  if (
    event.target instanceof Element &&
    (event.target.tagName === 'BUTTON' ||
      event.target.tagName === 'INPUT' ||
      event.target.tagName === 'OPTION' ||
      event.target.tagName === 'SELECT' ||
      event.target.tagName === 'TEXTAREA')
  ) {
    // @todo что если внутри кнопки svg?
    return false;
  }

  return true;
}

/**
 * Hook of simple "drag and drop".
 * @param ref Target element.
 * @param options Options.
 */
export function useDragAndDrop<T extends HTMLElement>(
  ref:
    | RefObject<T>
    | RefObject<T | null>
    | RefObject<T | undefined>
    | MutableRefObject<T>
    | MutableRefObject<T | null>
    | MutableRefObject<T | undefined>,
  {
    strategy = 'absolute',
    disabled,
    onGrab,
    onMove,
    onDrop,
    extraDeps = zeroDeps,
    needPreventTouchEvent = canStartDrag,
  }: UseDragAndDropOptions = {},
): void {
  const state = useMemo(getInitialState, zeroDeps);

  const onPointerDown = useStableCallback((event: PointerEvent) => {
    const element = ref.current;

    if (!element) {
      return;
    }

    if (!canStartDrag(event)) {
      return;
    }

    // @todo ability to disable
    element.releasePointerCapture(event.pointerId);

    // @todo ability to disable
    document.getSelection()?.removeAllRanges();

    const clientPosition = Vector2.of(event.clientX, event.clientY);
    const newInnerOffset = clientPosition.clone().subtract(element.getBoundingClientRect());
    const newOffset = clientPosition
      .clone()
      .subtract(newInnerOffset)
      .subtract(getPositionedParentOffset(element, { strategy }));

    state.captured = true;
    state.offset = newOffset;
    state.innerOffset = newInnerOffset;

    onGrab?.({
      offset: newOffset.clone(),
      clientPosition,
    });
  });

  const onPointerMove = useStableCallback((event: PointerEvent) => {
    if (!state.captured) {
      return;
    }

    const element = ref.current;

    if (!element) {
      return;
    }

    const clientPosition = Vector2.of(event.clientX, event.clientY);
    const newOffset = clientPosition
      .clone()
      .subtract(state.innerOffset)
      .subtract(getPositionedParentOffset(element));

    state.offset = newOffset;

    onMove?.({
      offset: newOffset.clone(),
      clientPosition,
    });
  });

  const onPointerUp = useStableCallback((event: PointerEvent) => {
    if (!state.captured) {
      return;
    }

    const clientPosition = Vector2.of(event.clientX, event.clientY);

    onDrop?.({
      offset: state.offset.clone(),
      clientPosition,
    });

    state.captured = false;
  });

  const onTouchStart = useStableCallback((event: TouchEvent) => {
    if (needPreventTouchEvent(event)) {
      event.preventDefault();
    }
  });

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (disabled || !element) {
      return;
    }

    element.addEventListener('touchstart', onTouchStart);
    element.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [
    ref,
    disabled,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onTouchStart,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...extraDeps,
  ]);
}
