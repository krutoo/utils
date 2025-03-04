import { createContext, useContext, type ReactNode, type Context, type JSX } from 'react';
import type { QueryManager } from './types.ts';

export const QueryMangerContext: Context<QueryManager | null> = createContext<QueryManager | null>(
  null,
);

/**
 * Provider of query manager.
 * @param props Props.
 * @returns React node.
 */
export function QueryMangerProvider({
  manager,
  children,
}: {
  manager: QueryManager;
  children?: ReactNode;
}): JSX.Element {
  return (
    <QueryMangerContext.Provider value={manager}>
      {/* just render children inside context */}
      {children}
    </QueryMangerContext.Provider>
  );
}

/**
 * Returns `QueryManager` instance provided by context.
 * Throws when context is not provided or empty.
 * @returns `QueryManager` instance.
 */
export function useQueryManager(): QueryManager {
  const manager = useContext(QueryMangerContext);

  if (!manager) {
    throw new Error('QueryManager is not provided by context');
  }

  return manager;
}
