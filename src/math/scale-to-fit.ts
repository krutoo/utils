import type { BoxSize2d } from './types.ts';

export function scaleToFit(target: BoxSize2d, container: BoxSize2d): BoxSize2d {
  const scale = Math.min(container.width / target.width, container.height / target.height);

  return {
    width: target.width * scale,
    height: target.height * scale,
  };
}
