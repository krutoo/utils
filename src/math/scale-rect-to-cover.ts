import type { RectSize } from './types.ts';

/**
 * Returns a rectangle that has same ratio as `target` but "covers" `area` by size.
 * Works like CSS-rule `object-fit: cover`.
 * @param target Target box.
 * @param area Area box.
 * @returns New box that fits into area.
 * @deprecated Use `scaleRectToFit(a, b, 'cover')` instead.
 */
export function scaleRectToCover(target: RectSize, area: RectSize): RectSize {
  const scale = Math.max(area.width / target.width, area.height / target.height);

  return {
    width: target.width * scale,
    height: target.height * scale,
  };
}
