import type { Point2d } from '../math/mod.ts';
import { findAncestor } from './find-ancestor.ts';
import { isScrollable } from './is-scrollable.ts';

export interface PositioningOptions {
  /** How target (floating) element will be positioned. */
  strategy?: 'absolute' | 'fixed';
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

  const offsetParent = findAncestor(
    element,
    strategy === 'fixed' ? isContainingBlockForFixed : isContainingBlock,
  );

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

  const scrollParent = findAncestor(element, isScrollable) ?? document.documentElement;

  // IMPORTANT: check offsetParent's scrollTop/scrollLeft
  if (offsetParent && offsetParent === scrollParent) {
    offset.x += scrollParent.scrollLeft;
    offset.y += scrollParent.scrollTop;
  }

  return offset;
}

/**
 * Check that element is "containing block".
 * @param element Element.
 * @returns True if element is containing block, false otherwise.
 */
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

/**
 * Check that element is "containing block" for fixed elements.
 * @param element Element.
 * @returns True if element is containing block, false otherwise.
 */
function isContainingBlockForFixed(element: Element): boolean {
  const style = getComputedStyle(element);

  return (
    style.transform !== 'none' ||
    style.perspective !== 'none' ||
    style.filter !== 'none' ||
    style.contain !== 'none'
  );
}

/**
 * Parses value of CSS property as number.
 * @param cssValue CSS value.
 * @returns Number.
 */
function cssValueToNumber(cssValue: string): number {
  return parseFloat(cssValue.replace(/[A-z]/g, '')) || 0;
}
