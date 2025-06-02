import { DOMRectReadOnlyMock } from './dom-rect-mock.ts';

export type PartialIntersectionObserverEntry = Pick<IntersectionObserverEntry, 'target'> &
  Partial<Omit<IntersectionObserverEntry, 'target'>>;

/**
 * Mock-implementation of IntersectionObserver.
 * Useful for unit testing.
 */
export class IntersectionObserverMock implements IntersectionObserver {
  /** @inheritdoc */
  readonly root: Element | Document | null;

  /** @inheritdoc */
  readonly rootMargin: string;

  /** @inheritdoc */
  readonly thresholds: ReadonlyArray<number>;

  /** Callback. */
  protected readonly callback: IntersectionObserverCallback;

  /** Observed elements. */
  protected readonly elements: Set<Element>;

  constructor(callback: IntersectionObserverCallback, init?: IntersectionObserverInit) {
    this.root = init?.root ?? null;
    this.rootMargin = init?.rootMargin ?? '0px 0px 0px 0px';
    this.thresholds = Array.isArray(init?.threshold) ? init.threshold : [init?.threshold ?? 0];

    this.callback = callback;
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

  /** @inheritdoc */
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /**
   * Calls callback with given entries.
   * Each entry can omit all fields except `target`.
   * @param entries Entries.
   */
  simulateIntersection(entries: PartialIntersectionObserverEntry[]): void {
    const readyEntries: IntersectionObserverEntry[] = [];

    for (const entry of entries) {
      const {
        target,
        boundingClientRect = new DOMRectReadOnlyMock(),
        intersectionRatio = 1,
        intersectionRect = new DOMRectReadOnlyMock(),
        isIntersecting = true,
        rootBounds = null,
        time = Date.now(),
      } = entry;

      readyEntries.push({
        target,
        boundingClientRect,
        intersectionRatio,
        intersectionRect,
        isIntersecting,
        rootBounds,
        time,
      });
    }

    this.callback(readyEntries, this);
  }
}
