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
   * Takes coordinates and returns vector.
   * @param x X coordinate.
   * @param y Y coordinate.
   * @returns Vector.
   */
  static of(x = 0, y = 0): Vector2 {
    return new Vector2(x, y);
  }

  /**
   * Returns vector from point-like interface.
   * @param source Point-like interface.
   * @returns Vector.
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
   * Adds value to the X coordinate.
   * @param x X coordinate.
   * @returns This.
   */
  addX(x: number): this {
    this.x += x;

    return this;
  }

  /**
   * Adds value to the Y coordinate.
   * @param y Y coordinate.
   * @returns This.
   */
  addY(y: number): this {
    this.y += y;

    return this;
  }
  /**
   * Subtracts value to the X coordinate.
   * @param x X coordinate.
   * @returns This.
   */
  subX(x: number): this {
    this.x -= x;

    return this;
  }

  /**
   * Subtracts value to the Y coordinate.
   * @param y Y coordinate.
   * @returns This.
   */
  subY(y: number): this {
    this.y -= y;

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
   * Multiplies this vector by given vector.
   * @param vector Vector.
   * @returns This.
   */
  multiply(vector: Point2d): this {
    this.x *= vector.x;
    this.y *= vector.y;

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

  /**
   * Rotates vector around origin.
   * @param radians Angle in radians.
   * @returns This.
   */
  rotate(radians: number): this {
    this.rotateAround({ x: 0, y: 0 }, radians);

    return this;
  }

  /**
   * Rotates vector around given pivot.
   * @param pivot Pivot.
   * @param radians Angle in radians.
   * @returns This.
   */
  rotateAround(pivot: Point2d, radians: number): this {
    // translate the point so the pivot is at the origin
    const translatedX = this.x - pivot.x;
    const translatedY = this.y - pivot.y;

    // rotate around the origin
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    const rotatedX = translatedX * cos - translatedY * sin;
    const rotatedY = translatedX * sin + translatedY * cos;

    // translate back
    this.x = rotatedX + pivot.x;
    this.y = rotatedY + pivot.y;

    return this;
  }
}
