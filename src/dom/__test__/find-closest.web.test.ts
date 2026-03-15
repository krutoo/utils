import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { findClosest } from '../find-closest.ts';

describe('findClosest', () => {
  test('should find ancestor correctly', () => {
    const main = document.createElement('main');
    const article = document.createElement('article');
    const div = document.createElement('div');
    const p = document.createElement('p');
    const span = document.createElement('span');

    article.role = 'custom';
    div.id = 'block';

    document.body.append(main);
    main.append(article);
    article.append(div);
    div.append(p);
    p.append(span);

    expect(findClosest(span, el => el.tagName === 'SPAN')).toBe(span);
    expect(findClosest(span, el => el.id === 'block')).toBe(div);
    expect(findClosest(span, el => el.role === 'custom')).toBe(article);
    expect(findClosest(span, el => el.tagName === 'MAIN')).toBe(main);

    expect(findClosest(span, el => el.id === 'hello')).toBe(null);
    expect(findClosest(span, el => el.role === 'foobar')).toBe(null);
  });
});
