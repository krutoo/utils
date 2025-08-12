import { expect } from '@std/expect';
import { describe, test } from 'node:test';
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect.ts';
import { useEffect, useLayoutEffect } from 'react';

describe('useIsomorphicLayoutEffect', () => {
  test('should be useLayoutEffect in browser', () => {
    expect(useIsomorphicLayoutEffect === useLayoutEffect).toBe(true);
    expect(useIsomorphicLayoutEffect === useEffect).toBe(false);
  });
});
