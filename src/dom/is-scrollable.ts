/**
 * Returns true if element is scrollable, false otherwise.
 * @param element Target element.
 * @returns True if element is scrollable, false otherwise.
 */
export function isScrollable(element: Element): boolean {
  let result = false;

  if (element) {
    const styles = getComputedStyle(element);

    result = /(auto|scroll)/.test(styles.overflow + styles.overflowX + styles.overflowY);
  }

  return result;
}
