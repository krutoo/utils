import { type Context, createContext } from 'react';

export interface IntersectionObserverContextValue {
  getObserver: (
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) => IntersectionObserver;
}

export const IntersectionObserverContext: Context<IntersectionObserverContextValue> = createContext(
  {
    getObserver(callback, options) {
      return new IntersectionObserver(callback, options);
    },
  },
);

IntersectionObserverContext.displayName = 'IntersectionObserverContext';
