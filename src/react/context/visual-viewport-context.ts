import { type Context, createContext } from 'react';

export interface VisualViewportContextValue {
  getVisualViewport(): VisualViewport | null;
}

export const VisualViewportContext: Context<VisualViewportContextValue> = createContext({
  getVisualViewport() {
    return window.visualViewport;
  },
});
