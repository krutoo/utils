import type { Container } from '../../di/mod.ts';
import { createContext, type Context } from 'react';

/**
 * Context for providing DI-container to component tree.
 */
export const ContainerContext: Context<Container | null> = createContext<Container | null>(null);

ContainerContext.displayName = 'ContainerContext';
