export function findOffsetParent(element: HTMLElement): Element | null {
  let parent: Element | null = element.offsetParent || document.body;

  if (getComputedStyle(parent).position === 'static') {
    parent = getComputedStyle(document.documentElement).position === 'static'
      ? null
      : document.documentElement;
  }

  return parent;
}
