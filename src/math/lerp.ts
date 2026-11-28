/**
 * Returns linear interpolation between two numbers.
 * @param x Start.
 * @param y Finish.
 * @param factor Factor.
 * @returns Value.
 */
export function lerp(x: number, y: number, factor: number): number {
  return (1 - factor) * x + factor * y;
}
