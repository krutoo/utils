import { createContext, type Context } from 'react';

export interface VisualViewportContextValue {
  getVisualViewport(): VisualViewport | null;
}

export const VisualViewportContext: Context<VisualViewportContextValue> = createContext({
  getVisualViewport() {
    return window.visualViewport;
  },
});
