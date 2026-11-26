import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { isEqualLocations, normalizeLocation } from '../utils.ts';

describe('isEqualLocations', () => {
  test('should compare components as is', () => {
    const location = { pathname: '/docs', search: '?a=1', hash: '#section' };

    expect(isEqualLocations(location, { ...location })).toBe(true);

    expect(isEqualLocations(location, { ...location, pathname: '/docs/' })).toBe(false);
    expect(isEqualLocations(location, { ...location, search: '?a=2' })).toBe(false);
    expect(isEqualLocations(location, { ...location, hash: '#other' })).toBe(false);
  });

  test('should treat normalized locations with trailing slash as equal', () => {
    const a = normalizeLocation({ pathname: '/docs/', search: '', hash: '' });
    const b = normalizeLocation({ pathname: '/docs', search: '', hash: '' });

    expect(isEqualLocations(a, b)).toBe(true);
  });

  test('should accept URL objects without normalizing them implicitly', () => {
    const currentUrl = new URL('http://localhost/docs');
    const nextUrl = new URL('/docs/', 'http://localhost/docs');

    expect(isEqualLocations(currentUrl, nextUrl)).toBe(false);
    expect(isEqualLocations(normalizeLocation(currentUrl), normalizeLocation(nextUrl))).toBe(true);
  });

  test('should ignore hash when flag "ignoreHash" is passed', () => {
    const a = { pathname: '/docs', search: '?a=1', hash: '#one' };

    expect(isEqualLocations(a, { ...a, hash: '#two' })).toBe(false);
    expect(isEqualLocations(a, { ...a, hash: '#two' }, 'ignoreHash')).toBe(true);

    expect(isEqualLocations(a, { ...a, pathname: '/other' }, 'ignoreHash')).toBe(false);
    expect(isEqualLocations(a, { ...a, search: '?a=2' }, 'ignoreHash')).toBe(false);
  });
});
