/**
 * Representation of point in two-dimensional space.
 */
export interface Point2d {
  /** Coordinate in x axis. */
  x: number;

  /** Coordinate in y axis. */
  y: number;
}

/**
 * Representation of rectangle size.
 */
export interface RectSize {
  /** Width. */
  width: number;

  /** Height. */
  height: number;
}

/**
 * Function that accepts range edges and returns number.
 */
export interface RandomBetween {
  (min: number, max: number): number;
}
