import { createContext, type Context } from 'react';
import { getStubLocation } from '../../router/utils.ts';
import type { Router } from '../../router/types.ts';

export const RouterContext: Context<Router> = createContext<Router>({
  getLocation: getStubLocation,
  navigate: () => {},
  go: () => {},
  subscribe: () => () => {},
  connect: () => () => {},
});

RouterContext.displayName = 'RouterContext';
