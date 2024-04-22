import { isScrollable } from "./is-scrollable.ts";

export function getScrollParent(
  element: Element | undefined | null
): HTMLElement {
  let result;

  if (!element || element === document.body) {
    result = document.body;
  } else {
    result = isScrollable(element.parentElement)
      ? element.parentElement
      : getScrollParent(element.parentElement);
  }

  return result as HTMLElement;
}
