/**
 * Finds closest ancestor element that matches condition.
 * @param element Target element to find ancestor.
 * @param predicate Function that check ancestor.
 * @returns Element or null.
 */
export function findAncestor(
  element: Element,
  predicate: (element: HTMLElement) => boolean,
): HTMLElement | null {
  let parent: HTMLElement | null = element.parentElement;

  while (parent) {
    if (predicate(parent)) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return parent;
}
