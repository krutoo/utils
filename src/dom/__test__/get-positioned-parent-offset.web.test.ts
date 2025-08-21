import { test, describe, mock } from 'node:test';
import { expect } from '@std/expect';
import { getPositionedParentOffset } from '../get-positioned-parent-offset.ts';
import { DOMRectReadOnlyMock } from '../../testing/dom-rect-mock.ts';

describe('getPositionedParentOffset', () => {
  test('should return offset correctly', () => {
    const parent = document.createElement('div');
    const target = document.createElement('div');

    window.scrollTo(10, 20);

    parent.style.position = 'relative';
    target.style.position = 'absolute';
    mock.method(parent, 'getBoundingClientRect', () => new DOMRectReadOnlyMock(100, 100, 100, 100));

    document.body.append(parent);
    parent.append(target);

    expect(getPositionedParentOffset(target)).toEqual({ x: 100, y: 100 });
  });
});
