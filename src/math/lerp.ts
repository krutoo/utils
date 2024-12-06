/**
 * Returns linear interpolation between two numbers.
 * @param start Start.
 * @param finish Finish.
 * @param factor Factor.
 * @returns Linear interpolation.
 */
export function lerp(start: number, finish: number, factor: number): number {
  return (1 - factor) * start + factor * finish;
}
