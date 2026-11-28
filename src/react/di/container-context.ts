import { type Context, createContext } from 'react';
import type { Container } from '../../di/types.ts';

/**
 * Context for providing DI-container to component tree.
 */
export const ContainerContext: Context<Container | null> = createContext<Container | null>(null);

ContainerContext.displayName = 'ContainerContext';
