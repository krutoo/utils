/**
 * Returns true if element is scrollable, false otherwise.
 * @param element Target element.
 * @returns True if element is scrollable, false otherwise.
 */
export function isScrollable(element: Element): boolean {
  const pattern = /(auto|scroll)/;
  const styles = getComputedStyle(element);

  return (
    pattern.test(styles.overflow) ||
    pattern.test(styles.overflowX) ||
    pattern.test(styles.overflowY)
  );
}
