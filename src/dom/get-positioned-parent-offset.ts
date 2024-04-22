import type { Point2d } from "../math/mod.ts";
import { findOffsetParent } from "./fing-offset-parent.ts";
import { getScrollParent } from "./get-scroll-parent.ts";

export function getPositionedParentOffset(element: HTMLElement): Point2d {
  const offsetParent = findOffsetParent(element);
  const scrollParent = getScrollParent(element);
  const correction = { x: window.scrollX, y: window.scrollY };

  if (offsetParent) {
    const parentRect = offsetParent.getBoundingClientRect();
    const parentStyle = getComputedStyle(offsetParent);

    correction.x = -parentRect.left;
    correction.y = -parentRect.top;

    // ВАЖНО: border-{top/left} влияют на начало координат родителя, учитываем
    correction.x -= cssValueToNumber(parentStyle.borderLeftWidth);
    correction.y -= cssValueToNumber(parentStyle.borderTopWidth);
  }

  // ВАЖНО: если offsetParent имеет собственную прокрутку - учитываем её
  if (offsetParent === scrollParent) {
    correction.x += scrollParent.scrollLeft;
    correction.y += scrollParent.scrollTop;
  }

  return correction;
}

function cssValueToNumber(cssValue: string): number {
  return parseFloat(cssValue.replace(/[A-z]/g, "")) || 0;
}
