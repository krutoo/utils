export interface FindClosestOptions {
  needBreakLoop?: (element: Element) => boolean;
}

/**
 * Traverses DOM tree up starting from given element.
 * Returns first element that predicate returns true for.
 * @param element Element.
 * @param predicate Function that gives element and returns boolean.
 * @param options Options.
 * @returns Element or null.
 */
export function findClosest(
  element: Element,
  predicate: (element: Element) => boolean,
  options?: FindClosestOptions,
): Element | null {
  const needBreakLoop = options?.needBreakLoop;

  let current: Element | null = element;

  while (current) {
    if (predicate(current)) {
      return current;
    }

    if (needBreakLoop?.(current)) {
      return null;
    }

    current = current.parentElement;
  }

  return null;
}
