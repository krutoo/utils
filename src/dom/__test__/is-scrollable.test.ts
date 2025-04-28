import { test, describe } from 'node:test';
import { expect } from '@std/expect';
import { isScrollable } from '../is-scrollable.ts';

const scrollableCases = [
  {
    property: 'overflow',
    value: 'scroll',
  },
  {
    property: 'overflow',
    value: 'auto',
  },

  {
    property: 'overflow-x',
    value: 'scroll',
  },
  {
    property: 'overflow-x',
    value: 'auto',
  },

  {
    property: 'overflow-y',
    value: 'scroll',
  },
  {
    property: 'overflow-y',
    value: 'auto',
  },
];

describe('isScrollable', () => {
  test('should return boolean correctly', () => {
    for (const { property, value } of scrollableCases) {
      const element = document.createElement('div');

      element.style.setProperty(property, value);
      document.body.append(element);

      expect(isScrollable(element)).toBe(true);
    }
  });
});
