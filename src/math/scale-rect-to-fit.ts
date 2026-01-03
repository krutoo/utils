import type { RectSize } from './types.ts';

/**
 * Returns a rectangle that has same ratio as `target` but fits `area` by size.
 * Works like CSS-rule `object-fit`, by default as `contain`.
 * @param target Target box.
 * @param area Area box.
 * @param strategy Strategy, `contain` or `cover`.
 * @returns New box that fits into area.
 */
export function scaleRectToFit(
  target: RectSize,
  area: RectSize,
  strategy: 'contain' | 'cover' = 'contain',
): RectSize {
  const selector = strategy === 'cover' ? Math.max : Math.min;
  const scale = selector(area.width / target.width, area.height / target.height);

  return {
    width: target.width * scale,
    height: target.height * scale,
  };
}
