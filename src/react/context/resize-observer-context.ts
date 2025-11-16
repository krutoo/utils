import { type Context, createContext } from 'react';

export interface ResizeObserverContextValue {
  getObserver: (callback: ResizeObserverCallback) => ResizeObserver;
}

export const ResizeObserverContext: Context<ResizeObserverContextValue> = createContext({
  getObserver(callback) {
    return new ResizeObserver(callback);
  },
});

ResizeObserverContext.displayName = 'ResizeObserverContext';
