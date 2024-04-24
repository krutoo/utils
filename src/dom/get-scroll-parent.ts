import { isScrollable } from './is-scrollable.ts';

/**
 * Returns closest scrollable parent.
 * @param element Target element.
 * @returns Closest scrollable parent.
 */
export function getScrollParent(
  element: Element | undefined | null,
): HTMLElement {
  let result: HTMLElement;

  if (!element || element === document.body) {
    result = document.body;
  } else {
    result = isScrollable(element.parentElement)
      ? element.parentElement
      : getScrollParent(element.parentElement);
  }

  return result;
}
