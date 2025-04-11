import { findAncestor } from './find-ancestor.ts';
import { isScrollable } from './is-scrollable.ts';

/**
 * Returns closest scrollable ancestor or null if there is no scrollable ancestors.
 * @param element Target element.
 * @returns Closest scrollable parent.
 */
export function findScrollParent(element: Element): HTMLElement | null {
  return findAncestor(element, isScrollable);
}
