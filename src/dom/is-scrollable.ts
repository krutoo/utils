export function isScrollable(element: HTMLElement | undefined | null): boolean {
  let result = false;

  if (element) {
    const styles = getComputedStyle(element);
    result = /(auto|scroll)/.test(
      styles.overflow + styles.overflowX + styles.overflowY
    );
  }

  return result;
}
