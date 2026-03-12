import { describe, test } from 'node:test';
import { useEffect, useLayoutEffect } from 'react';
import { expect } from '@std/expect';
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect.ts';

describe('useIsomorphicLayoutEffect', () => {
  test('should be useEffect in Node.js', () => {
    expect(useIsomorphicLayoutEffect === useLayoutEffect).toBe(false);
    expect(useIsomorphicLayoutEffect === useEffect).toBe(true);
  });
});
