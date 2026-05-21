import type { Context, ReactNode } from 'react';
import type { Container } from '../../di/types.ts';
import { ContainerContext } from './container-context.ts';

export interface ContainerProviderProps {
  /** Children. */
  children?: ReactNode;

  /** DI-container. */
  container: Container;

  /** Context that will be used to provide container. */
  context?: Context<Container | null>;
}

/**
 * Provider of DI-container.
 * @param props Props.
 * @returns ReactNode.
 */
export function ContainerProvider({
  container,
  context: Context = ContainerContext,
  children,
}: ContainerProviderProps): ReactNode {
  return <Context.Provider value={container}>{children}</Context.Provider>;
}
