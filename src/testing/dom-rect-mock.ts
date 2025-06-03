/**
 * Mock-implementation of DOMRectReadOnly.
 * Useful for unit testing.
 */
export class DOMRectReadOnlyMock implements DOMRectReadOnly {
  /** @inheritdoc */
  readonly bottom: number;

  /** @inheritdoc */
  readonly height: number;

  /** @inheritdoc */
  readonly left: number;

  /** @inheritdoc */
  readonly right: number;

  /** @inheritdoc */
  readonly top: number;

  /** @inheritdoc */
  readonly width: number;

  /** @inheritdoc */
  readonly x: number;

  /** @inheritdoc */
  readonly y: number;

  /** @inheritdoc */
  constructor(
    x: number | undefined = 0,
    y: number | undefined = 0,
    width: number | undefined = 0,
    height: number | undefined = 0,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.top = y;
    this.left = x;
    this.bottom = y + height;
    this.right = x + width;

    Object.freeze(this);
  }

  /** @inheritdoc */
  toJSON(): any {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      top: this.top,
      left: this.left,
      bottom: this.bottom,
      right: this.right,
    };
  }
}
