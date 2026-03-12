import { type Context, createContext } from 'react';
import type { Router } from '../../router/types.ts';
import { getStubLocation } from '../../router/utils.ts';

export const RouterContext: Context<Router> = createContext<Router>({
  getLocation: getStubLocation,
  navigate: () => {},
  go: () => {},
  subscribe: () => () => {},
  connect: () => () => {},
});

RouterContext.displayName = 'RouterContext';
