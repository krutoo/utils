import type { DependencyList } from 'react';

/**
 * Just an empty array.
 * Need for micro-optimizations in cases when you don't want to create deps array on each render.
 */
export const zeroDeps: DependencyList = [];
