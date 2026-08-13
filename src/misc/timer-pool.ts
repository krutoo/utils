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

export interface TimersAPI {
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;

  setInterval: typeof setInterval;
  clearInterval: typeof clearInterval;

  requestAnimationFrame: typeof requestAnimationFrame;
  cancelAnimationFrame: typeof cancelAnimationFrame;
}

export interface TimerPoolOptions {
  /** Timers API. By default global functions will be used. */
  timersAPI?: TimersAPI;
}

/**
 * Timer pool.
 * Primarily exists for able to clear all registered timers.
 */
export class TimerPool {
  protected api: TimersAPI;
  protected timers: Set<TimerPoolEntry>;

  constructor(options?: TimerPoolOptions) {
    this.api = options?.timersAPI ?? globalThis;
    this.timers = new Set();
  }

  setTimeout(callback: VoidFunction, ms?: number): ReturnType<typeof setTimeout> {
    const entry: TimerPoolEntry = {
      type: 'timeout',
      id: this.api.setTimeout(() => {
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
      id: this.api.setInterval(() => {
        callback();
      }, ms),
    };

    this.timers.add(entry);

    return entry.id;
  }

  requestAnimationFrame(callback: FrameRequestCallback): ReturnType<typeof requestAnimationFrame> {
    const entry: TimerPoolEntry = {
      type: 'raf',
      id: this.api.requestAnimationFrame(ts => {
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
          this.api.clearTimeout(item.id);
          continue;
        }
        case 'interval': {
          this.api.clearInterval(item.id);
          continue;
        }
        case 'raf': {
          this.api.cancelAnimationFrame(item.id);
          continue;
        }
      }
    }
    this.timers.clear();
  }
}
