import { useContext, useMemo } from 'react';
import { ContainerContext } from './context/container-context.ts';
import type { Token } from '../di/mod.ts';

/**
 * Returns component from container by token.
 * @param token Token.
 * @returns Component implementation.
 */
export function useDependency<T>(token: Token<T>): T | undefined {
  const container = useContext(ContainerContext);

  if (!container) {
    throw new Error('ContainerContext not provided or empty');
  }

  return useMemo<T>(() => container.get(token), [container, token]);
}
