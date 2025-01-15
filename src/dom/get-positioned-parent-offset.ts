import type { Point2d } from '../math/mod.ts';
import { findScrollParent } from './find-scroll-parent.ts';

/**
 * @todo Для этой функции в документации надо показать способ применения.
 * Чтобы было видно зачем она нужна.
 *
 * Также стоит написать e2e-тесты, подготовив какой-то тестовый полигон.
 * Чтобы можно было проверить следующие сценарии:
 * - всплывающий элемент корректно позиционируется когда находится в том же родителе что и целевой;
 * - всплывающий элемент корректно позиционируется когда находится НЕ в том же родителе что и целевой;
 * - всплывающий элемент корректно позиционируется при прокрутке страницы;
 * - всплывающий элемент корректно позиционируется при прокрутке контейнера целевого элемента.
 */

/**
 * Returns position of top left corner of the parent positioned element relative to viewport origin.
 * @param element Target element.
 * @returns Offset.
 */
export function getPositionedParentOffset(element: HTMLElement): Point2d {
  if (!element.isConnected) {
    return { x: 0, y: 0 };
  }

  const offsetParent = element.offsetParent;
  const scrollParent = findScrollParent(element) ?? document.documentElement;

  const offset: Point2d = {
    x: window.scrollX,
    y: window.scrollY,
  };

  if (offsetParent) {
    const parentRect = offsetParent.getBoundingClientRect();
    const parentStyle = getComputedStyle(offsetParent);

    offset.x = parentRect.left;
    offset.y = parentRect.top;

    // IMPORTANT: border-top/border-left affects parent positioning origin
    offset.x += cssValueToNumber(parentStyle.borderLeftWidth);
    offset.y += cssValueToNumber(parentStyle.borderTopWidth);
  }

  // ВАЖНО: check offsetParent's scrollTop/scrollLeft
  if (offsetParent && offsetParent === scrollParent) {
    offset.x += scrollParent.scrollLeft;
    offset.y += scrollParent.scrollTop;
  }

  return offset;
}

function cssValueToNumber(cssValue: string): number {
  return parseFloat(cssValue.replace(/[A-z]/g, '')) || 0;
}
