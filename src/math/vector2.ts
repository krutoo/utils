import type { Point2d } from './types.ts';

/**
 * Operations with two-dimensional vector.
 */
export class Vector2 implements Point2d {
  /** Coordinate in x axis. */
  x: number;

  /** Coordinate in y axis. */
  y: number;

  /**
   * Vector2 constructor.
   * @param x X coordinate.
   * @param y Y coordinate.
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Returns point.
   * @param x X coordinate.
   * @param y Y coordinate.
   * @returns Point.
   */
  static of(x = 0, y = 0): Vector2 {
    return new Vector2(x, y);
  }

  /**
   * Returns point from point-like interface.
   * @param source Point-like interface.
   * @returns Point.
   */
  static from<T extends Point2d>(source: T): Vector2 {
    return new Vector2(source.x, source.y);
  }

  /**
   * Returns plain object with coordinates of vector.
   * @returns Plain object.
   */
  toJSON(): Point2d {
    return {
      x: this.x,
      y: this.y,
    };
  }

  /**
   * Returns new instance of Vector2 with same x and y.
   * @returns New instance.
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Sets the X coordinate.
   * @param x X coordinate.
   * @returns This.
   */
  setX(x: number): this {
    this.x = x;

    return this;
  }

  /**
   * Sets the Y coordinate.
   * @param y Y coordinate.
   * @returns This.
   */
  setY(y: number): this {
    this.y = y;

    return this;
  }

  /**
   * Vector addition.
   * @param vector Vector.
   * @returns This.
   */
  add(vector: Point2d): this {
    this.x += vector.x;
    this.y += vector.y;

    return this;
  }

  /**
   * Vector subtraction.
   * @param vector Vector.
   * @returns This.
   */
  subtract(vector: Point2d): this {
    this.x -= vector.x;
    this.y -= vector.y;

    return this;
  }

  /**
   * Multiplying a vector by a scalar.
   * @param scalar Scalar.
   * @returns This.
   */
  scale(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;

    return this;
  }

  /**
   * Makes length equals to 1.
   * @returns This.
   */
  normalize(): this {
    const value = 1 / this.getLength();
    this.x *= value;
    this.y *= value;

    return this;
  }

  /**
   * Check that two vectors are equal.
   * @param vector Vector.
   * @returns True if vectors are equal, false otherwise.
   */
  equalsTo(vector: Point2d): boolean {
    return this.x === vector.x && this.y === vector.y;
  }

  /**
   * Returns distance between two vectors.
   * @param vector Vector.
   * @returns Distance.
   */
  getDistance(vector: Point2d): number {
    return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2);
  }

  /**
   * Returns length of vector.
   * @returns Length.
   */
  getLength(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}
