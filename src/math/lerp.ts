export function lerp(start: number, end: number, current: number): number {
  return (1 - current) * start + current * end;
}
