import { isScrollable } from './is-scrollable.ts';

/**
 * Returns closest scrollable parent.
 * @param element Target element.
 * @returns Closest scrollable parent.
 */
export function fundScrollParent(
  element: Element,
): HTMLElement | null {
  let parent: HTMLElement | null = element.parentElement;

  while (parent && !isScrollable(parent)) {
    parent = parent.parentElement;
  }

  return parent;
}
