import { type RefObject, useEffect, useState, DependencyList } from 'react';
import { type Point2d, Vector2 } from '../math/mod.ts';
import { useStableCallback } from './use-stable-callback.ts';
import { getPositionedParentOffset } from '../dom/mod.ts';

export interface DnDEventHandler {
  (event: { offset: Point2d; clientPosition: Point2d }): void;
}

export interface UseDragAndDropOptions {
  disabled?: boolean;
  onMove?: DnDEventHandler;
  onDrop?: DnDEventHandler;
  extraDeps?: DependencyList;
}

export interface UseDragAndDropReturn {
  captured: boolean;
  offset: Point2d;
}

/**
 * Hook of simple "drag and drop".
 * @param ref Target element.
 * @param options Options.
 * @returns State.
 */
export function useDragAndDrop<T extends HTMLElement>(
  ref: RefObject<T>,
  { disabled, onMove, onDrop, extraDeps = [] }: UseDragAndDropOptions = {},
): UseDragAndDropReturn {
  const [captured, setCaptured] = useState<boolean>(false);
  const [innerOffset, setInnerOffset] = useState<Vector2>(() => Vector2.of(0, 0));
  const [offset, setOffset] = useState<Vector2>(() => Vector2.of(0, 0));

  const onPointerDown = useStableCallback((event: PointerEvent) => {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.releasePointerCapture(event.pointerId);
    document.getSelection()?.removeAllRanges();

    const clientPosition = Vector2.of(event.clientX, event.clientY);
    const newInnerOffset = clientPosition.clone().subtract(element.getBoundingClientRect());
    const newOffset = clientPosition
      .clone()
      .subtract(newInnerOffset)
      .subtract(getPositionedParentOffset(element));

    setInnerOffset(newInnerOffset);
    setOffset(newOffset);
    setCaptured(true);
  });

  const onPointerMove = useStableCallback((event: PointerEvent) => {
    const element = ref.current;

    if (!element) {
      return;
    }

    if (!captured) {
      return;
    }

    const clientPosition = Vector2.of(event.clientX, event.clientY);
    const newOffset = clientPosition
      .clone()
      .subtract(innerOffset)
      .subtract(getPositionedParentOffset(element));

    setOffset(newOffset);

    onMove?.({
      offset: newOffset,
      clientPosition,
    });
  });

  const onPointerUp = useStableCallback((event: PointerEvent) => {
    if (!captured) {
      return;
    }

    const clientPosition = Vector2.of(event.clientX, event.clientY);

    onDrop?.({
      offset,
      clientPosition,
    });

    setCaptured(false);
  });

  const onTouchStart = useStableCallback((event: TouchEvent) => {
    event.preventDefault();
  });

  useEffect(() => {
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
  }, [ref, disabled, onPointerDown, onPointerMove, onPointerUp, onTouchStart, ...extraDeps]);

  return { captured, offset };
}
