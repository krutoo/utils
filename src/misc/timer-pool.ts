export type TimerPoolEntry =
  | {
      type: 'timeout';
      id: ReturnType<typeof setTimeout>;
    }
  | {
      type: 'interval';
      id: ReturnType<typeof setInterval>;
    }
  | {
      type: 'raf';
      id: ReturnType<typeof requestAnimationFrame>;
    };

/**
 * Timer pool.
 * Primarily exists for able to clear all registered timers.
 */
export class TimerPool {
  protected timers: Set<TimerPoolEntry>;

  constructor() {
    this.timers = new Set();
  }

  setTimeout(callback: VoidFunction, ms?: number): ReturnType<typeof setTimeout> {
    const entry: TimerPoolEntry = {
      type: 'timeout',
      id: setTimeout(() => {
        callback();
        this.timers.delete(entry);
      }, ms),
    };

    this.timers.add(entry);

    return entry.id;
  }

  setInterval(callback: VoidFunction, ms?: number): ReturnType<typeof setInterval> {
    const entry: TimerPoolEntry = {
      type: 'interval',
      id: setInterval(() => {
        callback();
      }, ms),
    };

    this.timers.add(entry);

    return entry.id;
  }

  requestAnimationFrame(callback: FrameRequestCallback): ReturnType<typeof requestAnimationFrame> {
    const entry: TimerPoolEntry = {
      type: 'raf',
      id: requestAnimationFrame(ts => {
        callback(ts);
        this.timers.delete(entry);
      }),
    };

    this.timers.add(entry);

    return entry.id;
  }

  clearAll(): void {
    for (const item of this.timers) {
      switch (item.type) {
        case 'timeout': {
          clearTimeout(item.id);
          continue;
        }
        case 'interval': {
          clearInterval(item.id);
          continue;
        }
        case 'raf': {
          cancelAnimationFrame(item.id);
          continue;
        }
      }
    }
    this.timers.clear();
  }
}
