import type { RectSize } from './types.ts';

/**
 * Returns a rectangle that has same ratio as `target` but fits `area` by size.
 * Works like CSS-rule `object-fit: contain`.
 * @param target Target box.
 * @param area Area box.
 * @returns New box that fits into area.
 */
export function scaleRectToFit(target: RectSize, area: RectSize): RectSize {
  const scale = Math.min(area.width / target.width, area.height / target.height);

  return {
    width: target.width * scale,
    height: target.height * scale,
  };
}
