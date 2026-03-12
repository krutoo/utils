import { describe, test } from 'node:test';
import { useEffect, useLayoutEffect } from 'react';
import { expect } from '@std/expect';
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect.ts';

describe('useIsomorphicLayoutEffect', () => {
  test('should be useLayoutEffect in browser', () => {
    expect(useIsomorphicLayoutEffect === useLayoutEffect).toBe(true);
    expect(useIsomorphicLayoutEffect === useEffect).toBe(false);
  });
});
