/**
 * Returns parent element that specifies the offset for positioning if exists.
 * @param element Target element.
 * @returns Parent or null.
 */
export function findOffsetParent(element: HTMLElement): Element | null {
  let parent: Element | null = element.offsetParent || document.body;

  if (getComputedStyle(parent).position === 'static') {
    parent = getComputedStyle(document.documentElement).position === 'static'
      ? null
      : document.documentElement;
  }

  return parent;
}
