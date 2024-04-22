import type { Point2d } from "./types.ts";

export abstract class Vector2 {
  static of(x = 0, y = 0): Point2d {
    return { x, y };
  }

  static from<T extends Point2d>(source: T): Point2d {
    return Vector2.of(source.x, source.y);
  }

  static add(a: Point2d, b: Point2d): Point2d {
    return Vector2.of(a.x + b.x, a.y + b.y);
  }

  static subtract(a: Point2d, b: Point2d): Point2d {
    return Vector2.of(a.x - b.x, a.y - b.y);
  }

  static scale(vector: Point2d, scalar: number): Point2d {
    return Vector2.of(vector.x * scalar, vector.y * scalar);
  }

  static equals(a: Point2d, b: Point2d): boolean {
    return a.x === b.x && a.y === b.y;
  }

  static distance(a: Point2d, b: Point2d): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  static length(vector: Point2d): number {
    return Math.sqrt(vector.x ** 2 + vector.y ** 2);
  }
}
