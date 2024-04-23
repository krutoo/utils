import type { RectSize } from './types.ts';

/**
 * Returns a rectangle that fits into the specified rectangular area while maintaining the aspect ratio.
 * @param target Target box.
 * @param area Area box.
 * @returns New box that fits into area.
 */
export function scaleToFit(target: RectSize, area: RectSize): RectSize {
  const scale = Math.min(area.width / target.width, area.height / target.height);

  return {
    width: target.width * scale,
    height: target.height * scale,
  };
}
