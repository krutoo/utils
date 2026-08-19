import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { DOMRectReadOnlyMock } from '../../testing/dom-rect-mock.ts';
import { getPositionedParentOffset } from '../get-positioned-parent-offset.ts';

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

  test('should handle out parameter', () => {
    const parent = document.createElement('div');
    const target = document.createElement('div');

    window.scrollTo(10, 20);

    parent.style.position = 'relative';
    target.style.position = 'absolute';
    mock.method(parent, 'getBoundingClientRect', () => new DOMRectReadOnlyMock(10, 20, 30, 40));

    document.body.append(parent);
    parent.append(target);

    const point = { x: 12, y: 34 };
    const result = getPositionedParentOffset(target, undefined, point);
    expect(result).toBe(point);
    expect(result.x).toEqual(10);
    expect(result.y).toEqual(20);
  });
});
