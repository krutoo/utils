import { type RefObject, useEffect, useState } from 'react';
import { type Point2d, Vector2 } from '../math/mod.ts';
import { useStableCallback } from './use-stable-callback.ts';
import { getPositionedParentOffset } from '../dom/mod.ts';

export interface DnDEventHandler {
  (event: { clientPosition: Point2d }): void;
}

export interface UseDragAndDropOptions {
  disabled?: boolean;
  onMove?: DnDEventHandler;
  onDrop?: DnDEventHandler;
}

export interface UseDragAndDropReturn {
  captured: boolean;
  offset: Point2d;
}

export function useDragAndDrop(
  ref: RefObject<HTMLElement>,
  { disabled, onDrop, onMove }: UseDragAndDropOptions,
): UseDragAndDropReturn {
  const [viewPos, setViewPos] = useState<Point2d>(() => Vector2.of(0, 0));
  const [captureOffset, setCaptureOffset] = useState<Point2d | null>(null);

  const onPointerDown = useStableCallback((event: PointerEvent) => {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.releasePointerCapture(event.pointerId);

    const rect = element.getBoundingClientRect();

    const newCaptureOffset = Vector2.of(
      rect.left - event.clientX,
      rect.top - event.clientY,
    );
    const parentOffset = getPositionedParentOffset(element);

    setCaptureOffset(newCaptureOffset);

    setViewPos(
      Vector2.of(
        event.clientX + parentOffset.x + newCaptureOffset.x,
        event.clientY + parentOffset.y + newCaptureOffset.y,
      ),
    );
  });

  const onPointerMove = useStableCallback((event: PointerEvent) => {
    const element = ref.current;

    if (!element) {
      return;
    }

    if (captureOffset) {
      const parentOffset = getPositionedParentOffset(element);

      setViewPos(
        Vector2.of(
          event.clientX + parentOffset.x + captureOffset.x,
          event.clientY + parentOffset.y + captureOffset.y,
        ),
      );

      onMove?.({
        clientPosition: Vector2.of(
          event.clientX + parentOffset.x + captureOffset.x,
          event.clientY + parentOffset.y + captureOffset.y,
        ),
      });
    }
  });

  const onPointerUp = useStableCallback(() => {
    if (!captureOffset) {
      return;
    }

    onDrop?.({
      clientPosition: Vector2.of(
        viewPos.x - captureOffset.x,
        viewPos.y - captureOffset.y,
      ),
    });

    setCaptureOffset(null);
  });

  const onTouchStart = useStableCallback((e: TouchEvent) => {
    e.preventDefault();
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
  }, [ref, disabled, onPointerDown, onPointerMove, onPointerUp, onTouchStart]);

  return { captured: Boolean(captureOffset), offset: viewPos };
}
