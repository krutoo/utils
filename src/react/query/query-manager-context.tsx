import { createContext, type Context } from 'react';
import type { QueryManager } from './types.ts';

export const QueryMangerContext: Context<QueryManager | null> = createContext<QueryManager | null>(
  null,
);

QueryMangerContext.displayName = 'QueryMangerContext';
