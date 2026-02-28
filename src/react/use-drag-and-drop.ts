import { type RefObject, type DependencyList, useMemo } from 'react';
import { type Point2d, Vector2 } from '../math/mod.ts';
import { getPositionedParentOffset } from '../dom/mod.ts';
import { useIsomorphicLayoutEffect } from '../react/use-isomorphic-layout-effect.ts';
import { useStableCallback } from '../react/use-stable-callback.ts';
import { zeroDeps } from './constants.ts';

export interface DnDEventHandler {
  (event: { target: HTMLElement; offset: Point2d; clientPosition: Point2d }): void;
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

  /** Will be called on `pointerdown` event, if false returns than drag will no be started. */
  needStartDrag?: (event: PointerEvent) => boolean;

  /** Extra deps for useEffect hook. */
  extraDeps?: DependencyList;
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
    pointerId: -1,
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
function canStartDragDefault(event: TouchEvent | PointerEvent | MouseEvent): boolean {
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
  ref: RefObject<T> | RefObject<T | null> | RefObject<T | undefined>,
  {
    strategy = 'absolute',
    disabled,
    onGrab,
    onMove,
    onDrop,
    extraDeps = zeroDeps,
    needStartDrag = canStartDragDefault,
  }: UseDragAndDropOptions = {},
): void {
  const state = useMemo(getInitialState, zeroDeps);

  const onPointerDown = useStableCallback((event: PointerEvent) => {
    if (state.captured) {
      return;
    }

    const element = ref.current;

    if (!element) {
      return;
    }

    if (!needStartDrag(event)) {
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

    state.pointerId = event.pointerId;
    state.captured = true;
    state.offset = newOffset;
    state.innerOffset = newInnerOffset;

    onGrab?.({
      target: element,
      offset: newOffset.clone(),
      clientPosition,
    });
  });

  const onPointerMove = useStableCallback((event: PointerEvent) => {
    if (!state.captured) {
      return;
    }

    if (state.pointerId !== event.pointerId) {
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
      target: element,
      offset: newOffset.clone(),
      clientPosition,
    });
  });

  const onPointerUp = useStableCallback((event: PointerEvent) => {
    if (!state.captured) {
      return;
    }

    if (state.pointerId !== event.pointerId) {
      return;
    }

    const element = ref.current;

    if (!element) {
      return;
    }

    const clientPosition = Vector2.of(event.clientX, event.clientY);

    onDrop?.({
      target: element,
      offset: state.offset.clone(),
      clientPosition,
    });

    state.pointerId = -1;
    state.captured = false;
  });

  // handle touchend because scrolling inside target mutes pointer events
  const onTouchEnd = useStableCallback((event: TouchEvent) => {
    const element = ref.current;

    if (!element) {
      return;
    }

    if (!(event.target instanceof Node && ref.current?.contains(event.target))) {
      return;
    }

    const clientPosition = Vector2.of(event.touches[0]?.clientX ?? 0, event.touches[0]?.clientY);

    onDrop?.({
      target: element,
      offset: state.offset.clone(),
      clientPosition,
    });

    state.pointerId = -1;
    state.captured = false;
  });

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (disabled || !element) {
      return;
    }

    element.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('touchend', onTouchEnd, true);

    return () => {
      element.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('touchend', onTouchEnd, true);
    };
  }, [
    ref,
    disabled,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onTouchEnd,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...extraDeps,
  ]);
}
