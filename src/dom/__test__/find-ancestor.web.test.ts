import { test, describe } from 'node:test';
import { expect } from '@std/expect';
import { findAncestor } from '../find-ancestor.ts';

describe('findAncestor', () => {
  test('Should find ancestor correctly', () => {
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

    expect(findAncestor(span, el => el.id === 'block')).toBe(div);
    expect(findAncestor(span, el => el.role === 'custom')).toBe(article);
    expect(findAncestor(span, el => el.tagName === 'MAIN')).toBe(main);

    expect(findAncestor(span, el => el.id === 'hello')).toBe(null);
    expect(findAncestor(span, el => el.role === 'foobar')).toBe(null);
  });
});
