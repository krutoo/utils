import { test, describe } from 'node:test';
import { expect } from '@std/expect';
import { findScrollParent } from '../find-scroll-parent.ts';

describe('findScrollParent', () => {
  test('should return ancestor properly', () => {
    const main = document.createElement('main');
    const article = document.createElement('article');
    const div = document.createElement('div');
    const span = document.createElement('span');

    document.body.append(main);
    main.append(article);
    article.append(div);
    div.append(span);

    article.style.setProperty('overflow-y', 'scroll');
    expect(findScrollParent(span)).toBe(article);

    article.style.removeProperty('overflow-y');
    expect(findScrollParent(span)).toBe(null);

    main.style.setProperty('overflow-y', 'scroll');
    expect(findScrollParent(span)).toBe(main);

    main.style.removeProperty('overflow-y');
    expect(findScrollParent(span)).toBe(null);
  });
});
