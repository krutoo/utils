import type { Point2d } from '../math/mod.ts';
import { findClosest } from './find-closest.ts';
import { isScrollable } from './is-scrollable.ts';

export interface PositioningOptions {
  /** How target (floating) element will be positioned. */
  strategy?: 'absolute' | 'fixed';
}

/**
 * Returns position of top left corner of the parent positioned element relative to viewport origin.
 * @param element Target element.
 * @param options Options.
 * @param out Out parameter.
 * @returns Offset.
 */
export function getPositionedParentOffset(
  element: HTMLElement,
  { strategy = 'absolute' }: PositioningOptions = {},
  out: Point2d = { x: 0, y: 0 },
): Point2d {
  out.x = 0;
  out.y = 0;

  if (!element.isConnected) {
    return out;
  }

  const offsetParent = element.parentElement
    ? findClosest(
        element.parentElement,
        strategy === 'fixed' ? isContainingBlockForFixed : isContainingBlock,
      )
    : null;

  if (strategy === 'absolute') {
    out.x = -window.scrollX;
    out.y = -window.scrollY;
  }

  if (offsetParent) {
    const parentRect = offsetParent.getBoundingClientRect();
    const parentStyle = getComputedStyle(offsetParent);

    out.x = parentRect.left;
    out.y = parentRect.top;

    // IMPORTANT: border-top/border-left affects parent positioning origin
    out.x += cssValueToNumber(parentStyle.borderLeftWidth);
    out.y += cssValueToNumber(parentStyle.borderTopWidth);
  }

  const scrollParent =
    (element.parentElement ? findClosest(element.parentElement, isScrollable) : null) ??
    document.documentElement;

  // IMPORTANT: check offsetParent's scrollTop/scrollLeft
  if (offsetParent && offsetParent === scrollParent) {
    out.x += scrollParent.scrollLeft;
    out.y += scrollParent.scrollTop;
  }

  return out;
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
