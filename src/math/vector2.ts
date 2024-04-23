import type { Point2d } from './types.ts';

/**
 * Operations with two-dimensional vector.
 */
export abstract class Vector2 {
  /**
   * Returns point.
   * @param x X coordinate.
   * @param y Y coordinate.
   * @returns Point.
   */
  static of(x = 0, y = 0): Point2d {
    return { x, y };
  }

  /**
   * Returns point from point-like interface.
   * @param source Point-like interface.
   * @returns Point.
   */
  static from<T extends Point2d>(source: T): Point2d {
    return Vector2.of(source.x, source.y);
  }

  /**
   * Vector addition.
   * @param a Vector.
   * @param b Vector.
   * @returns Vector.
   */
  static add(a: Point2d, b: Point2d): Point2d {
    return Vector2.of(a.x + b.x, a.y + b.y);
  }

  /**
   * Vector subtraction
   * @param a Vector.
   * @param b Vector.
   * @returns Vector.
   */
  static subtract(a: Point2d, b: Point2d): Point2d {
    return Vector2.of(a.x - b.x, a.y - b.y);
  }

  /**
   * Multiplying a vector by a scalar.
   * @param vector Point.
   * @param scalar Scalar.
   * @returns Vector.
   */
  static scale(vector: Point2d, scalar: number): Point2d {
    return Vector2.of(vector.x * scalar, vector.y * scalar);
  }

  /**
   * Check that two vectors are equal.
   * @param a Vector.
   * @param b Vector.
   * @returns True if vectors are equal, false otherwise.
   */
  static equals(a: Point2d, b: Point2d): boolean {
    return a.x === b.x && a.y === b.y;
  }

  /**
   * Returns distance between two vectors.
   * @param a Vector.
   * @param b Vector.
   * @returns Distance.
   */
  static distance(a: Point2d, b: Point2d): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  /**
   * Returns length of vector.
   * @param vector Vector.
   * @returns Length.
   */
  static length(vector: Point2d): number {
    return Math.sqrt(vector.x ** 2 + vector.y ** 2);
  }
}
