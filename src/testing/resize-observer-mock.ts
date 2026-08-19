import { DOMRectReadOnlyMock } from './dom-rect-mock.ts';

export type PartialResizeObserverEntry = Pick<ResizeObserverEntry, 'target'> &
  Partial<Omit<ResizeObserverEntry, 'target'>>;

/**
 * Mock-implementation of `ResizeObserver` with ability of simulating resize programmatically.
 * Useful for unit testing.
 */
export class ResizeObserverMock implements ResizeObserver {
  /** Callbacks. */
  protected readonly callbacks: Set<ResizeObserverCallback>;

  /** Observed elements. */
  protected readonly elements: Set<Element>;

  constructor(callback: ResizeObserverCallback) {
    this.callbacks = new Set([callback]);
    this.elements = new Set();
  }

  /** @inheritdoc */
  observe(target: Element): void {
    this.elements.add(target);
  }

  /** @inheritdoc */
  unobserve(target: Element): void {
    this.elements.delete(target);
  }

  /** @inheritdoc */
  disconnect(): void {
    this.elements.clear();
  }

  /**
   * Calls callback with given entries.
   * Each entry can omit all fields except `target`.
   * @param entries Entries.
   */
  simulateResize(entries: PartialResizeObserverEntry[]): void {
    const readyEntries: ResizeObserverEntry[] = [];

    for (const entry of entries) {
      const {
        target,
        borderBoxSize = [],
        contentBoxSize = [],
        devicePixelContentBoxSize = [],
        contentRect = new DOMRectReadOnlyMock(),
      } = entry;

      readyEntries.push({
        target,
        borderBoxSize,
        contentBoxSize,
        contentRect,
        devicePixelContentBoxSize,
      });
    }

    this.callbacks.forEach(fn => fn(readyEntries, this));
  }

  /**
   * Adds callback.
   * Useful to define single observer during tests and add callbacks to it.
   * @param callback Callback.
   * @returns This instance.
   */
  addCallback(callback: ResizeObserverCallback): this {
    this.callbacks.add(callback);

    return this;
  }
}
