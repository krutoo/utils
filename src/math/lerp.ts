/**
 * Returns linear interpolation between two numbers.
 * @param start Start.
 * @param end End.
 * @param factor Factor.
 * @returns Linear interpolation.
 */
export function lerp(start: number, end: number, factor: number): number {
  return (1 - factor) * start + factor * end;
}
