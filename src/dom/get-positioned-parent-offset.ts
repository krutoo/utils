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

export interface PositioningOptions {
  /** How target (floating) element will be positioned. */
  strategy?: 'fixed' | 'absolute';
}

function isContainingBlock(element: Element): boolean {
  const style = getComputedStyle(element);

  return (
    style.position === 'relative' ||
    style.position === 'absolute' ||
    style.position === 'fixed' ||
    style.transform !== 'none' ||
    style.perspective !== 'none' ||
    style.filter !== 'none' ||
    style.contain !== 'none'
  );
}

function isContainingBlockForFixed(element: Element): boolean {
  const style = getComputedStyle(element);

  return (
    style.transform !== 'none' ||
    style.perspective !== 'none' ||
    style.filter !== 'none' ||
    style.contain !== 'none'
  );
}

function findOffsetParent(
  element: Element,
  { strategy = 'absolute' }: PositioningOptions,
): HTMLElement | null {
  // Идем вверх по дереву DOM
  let parent = element.parentElement;

  const match = strategy === 'fixed' ? isContainingBlockForFixed : isContainingBlock;

  while (parent) {
    if (match(parent)) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return null;
}

/**
 * Returns position of top left corner of the parent positioned element relative to viewport origin.
 * @param element Target element.
 * @param options Options.
 * @returns Offset.
 */
export function getPositionedParentOffset(
  element: HTMLElement,
  { strategy = 'absolute' }: PositioningOptions = {},
): Point2d {
  if (!element.isConnected) {
    return { x: 0, y: 0 };
  }

  const offsetParent = findOffsetParent(element, { strategy });

  const offset: Point2d = {
    x: 0,
    y: 0,
  };

  if (strategy === 'absolute') {
    offset.x = -window.scrollX;
    offset.y = -window.scrollY;
  }

  if (offsetParent) {
    const parentRect = offsetParent.getBoundingClientRect();
    const parentStyle = getComputedStyle(offsetParent);

    offset.x = parentRect.left;
    offset.y = parentRect.top;

    // IMPORTANT: border-top/border-left affects parent positioning origin
    offset.x += cssValueToNumber(parentStyle.borderLeftWidth);
    offset.y += cssValueToNumber(parentStyle.borderTopWidth);
  }

  const scrollParent = findScrollParent(element) ?? document.documentElement;

  // IMPORTANT: check offsetParent's scrollTop/scrollLeft
  if (offsetParent && offsetParent === scrollParent) {
    offset.x += scrollParent.scrollLeft;
    offset.y += scrollParent.scrollTop;
  }

  return offset;
}

function cssValueToNumber(cssValue: string): number {
  return parseFloat(cssValue.replace(/[A-z]/g, '')) || 0;
}
