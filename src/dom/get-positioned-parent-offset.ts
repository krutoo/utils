import type { Point2d } from '../math/mod.ts';
import { findOffsetParent } from './find-offset-parent.ts';
import { fundScrollParent } from './find-scroll-parent.ts';

/**
 * Returns the offset relative to the top left edge of the parent positioned element.
 * @param element Target element.
 * @returns Offset.
 */
export function getPositionedParentOffset(element: HTMLElement): Point2d {
  if (!element.isConnected) {
    return { x: 0, y: 0 };
  }

  const offsetParent = findOffsetParent(element);
  const scrollParent = fundScrollParent(element) ?? document.body;

  const offset: Point2d = {
    x: window.scrollX,
    y: window.scrollY,
  };

  if (offsetParent) {
    const parentRect = offsetParent.getBoundingClientRect();
    const parentStyle = getComputedStyle(offsetParent);

    offset.x = -parentRect.left;
    offset.y = -parentRect.top;

    // ВАЖНО: border-{top/left} влияют на начало координат родителя, учитываем
    offset.x -= cssValueToNumber(parentStyle.borderLeftWidth);
    offset.y -= cssValueToNumber(parentStyle.borderTopWidth);
  }

  // ВАЖНО: если offsetParent имеет собственную прокрутку - учитываем её
  if (offsetParent === scrollParent) {
    offset.x += scrollParent.scrollLeft;
    offset.y += scrollParent.scrollTop;
  }

  return offset;
}

function cssValueToNumber(cssValue: string): number {
  return parseFloat(cssValue.replace(/[A-z]/g, '')) || 0;
}
