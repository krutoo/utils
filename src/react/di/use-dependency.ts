import { type Context, useContext, useMemo } from 'react';
import type { Container, Token } from '../../di/mod.ts';
import { ContainerContext } from './container-context.ts';

export interface DependencyHook {
  <T>(token: Token<T>): T;
}

/**
 * Returns new hook for resolving dependencies from DI-container.
 * @param context Context.
 * @returns React hook.
 */
export function createDependencyHook(context: Context<Container | null>): DependencyHook {
  const useDependency: DependencyHook = <T>(token: Token<T>): T => {
    const container = useContext(context);

    if (!container) {
      throw new Error('ContainerContext not provided or empty');
    }

    return useMemo<T>(() => container.get(token), [container, token]);
  };

  return useDependency;
}

/**
 * Returns component from container by token.
 * @param token Token.
 * @returns Component implementation.
 */
export const useDependency: DependencyHook = createDependencyHook(ContainerContext);
