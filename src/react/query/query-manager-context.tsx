import { type Context, createContext } from 'react';
import type { QueryManager } from './types.ts';

export const QueryMangerContext: Context<QueryManager | null> = createContext<QueryManager | null>(
  null,
);

QueryMangerContext.displayName = 'QueryMangerContext';
