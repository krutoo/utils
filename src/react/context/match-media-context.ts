import { type Context, createContext } from 'react';

export interface MatchMediaContextValue {
  matchMedia: (query: string) => MediaQueryList;
}

export const MatchMediaContext: Context<MatchMediaContextValue> = createContext({
  // IMPORTANT: we should use match media global inside function instead pass it to defaultValue of context
  // it is because context may be used in environment that has not `matchMedia` global
  matchMedia(query) {
    return matchMedia(query);
  },
});
