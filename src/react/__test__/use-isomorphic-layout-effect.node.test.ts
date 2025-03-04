import { expect } from '@std/expect';
import { describe, test } from 'node:test';
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect.ts';
import { useEffect, useLayoutEffect } from 'react';

describe('useIsomorphicLayoutEffect', () => {
  test('should be useLayoutEffect in Node.js', () => {
    expect(useIsomorphicLayoutEffect === useLayoutEffect).toBe(false);
    expect(useIsomorphicLayoutEffect === useEffect).toBe(true);
  });
});
