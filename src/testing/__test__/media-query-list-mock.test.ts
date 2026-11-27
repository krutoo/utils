import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { MediaQueryListEventMock, MediaQueryListMock } from '../media-query-list-mock.ts';

describe('MediaQueryListMock', () => {
  test('should store query and initial state', () => {
    const mql = new MediaQueryListMock('(min-width: 1024px)');

    expect(mql.media).toBe('(min-width: 1024px)');
    expect(mql.matches).toBe(false);
    expect(mql.onchange).toBe(null);
  });

  describe('simulateChange', () => {
    test('should update matches and dispatch change event', () => {
      const mql = new MediaQueryListMock('(min-width: 1024px)');
      const handler = mock.fn();
      mql.onchange = handler;

      mql.simulateChange({ matches: true });

      expect(mql.matches).toBe(true);
      expect(handler.mock.callCount()).toBe(1);

      const event = handler.mock.calls[0]?.arguments[0] as MediaQueryListEvent;
      expect(event.type).toBe('change');
      expect(event.matches).toBe(true);
      expect(event.media).toBe('(min-width: 1024px)');
    });

    test('should not dispatch event when matches is unchanged', () => {
      const mql = new MediaQueryListMock('(min-width: 1024px)');
      const handler = mock.fn();
      mql.onchange = handler;

      mql.simulateChange({ matches: false });

      expect(mql.matches).toBe(false);
      expect(handler.mock.callCount()).toBe(0);
    });

    test('should dispatch event for every actual change', () => {
      const mql = new MediaQueryListMock('(min-width: 1024px)');
      const handler = mock.fn();
      mql.onchange = handler;

      mql.simulateChange({ matches: true });
      mql.simulateChange({ matches: false });
      mql.simulateChange({ matches: true });

      expect(handler.mock.callCount()).toBe(3);
      expect(mql.matches).toBe(true);
    });
  });

  describe('onchange', () => {
    test('should be null by default', () => {
      expect(new MediaQueryListMock('(min-width: 1024px)').onchange).toBe(null);
    });

    test('should store assigned handler and call it on change', () => {
      const mql = new MediaQueryListMock('(min-width: 1024px)');
      const handler = mock.fn();
      mql.onchange = handler;

      expect(mql.onchange).toBe(handler);

      mql.simulateChange({ matches: true });

      expect(handler.mock.callCount()).toBe(1);
    });

    test('should not call previous handler after replacement', () => {
      const mql = new MediaQueryListMock('(min-width: 1024px)');
      const first = mock.fn();
      const second = mock.fn();
      mql.onchange = first;
      mql.onchange = second;

      expect(mql.onchange).toBe(second);

      mql.simulateChange({ matches: true });

      expect(first.mock.callCount()).toBe(0);
      expect(second.mock.callCount()).toBe(1);
    });

    test('should not call handler after assignment of null', () => {
      const mql = new MediaQueryListMock('(min-width: 1024px)');
      const handler = mock.fn();
      mql.onchange = handler;
      mql.onchange = null;

      expect(mql.onchange).toBe(null);

      mql.simulateChange({ matches: true });

      expect(handler.mock.callCount()).toBe(0);
    });
  });

  describe('addListener / removeListener', () => {
    test('should register listener through addListener', () => {
      const mql = new MediaQueryListMock('(min-width: 1024px)');
      const handler = mock.fn();
      mql.addListener(handler);

      expect(mql.onchange).toBe(null);

      mql.simulateChange({ matches: true });

      expect(handler.mock.callCount()).toBe(1);
    });

    test('should support multiple listeners', () => {
      const mql = new MediaQueryListMock('(min-width: 1024px)');
      const first = mock.fn();
      const second = mock.fn();
      mql.addListener(first);
      mql.addListener(second);

      mql.simulateChange({ matches: true });

      expect(first.mock.callCount()).toBe(1);
      expect(second.mock.callCount()).toBe(1);
    });

    test('should remove listener through removeListener', () => {
      const mql = new MediaQueryListMock('(min-width: 1024px)');
      const handler = mock.fn();
      mql.addListener(handler);
      mql.removeListener(handler);

      mql.simulateChange({ matches: true });

      expect(handler.mock.callCount()).toBe(0);
    });

    test('should not affect onchange slot', () => {
      const mql = new MediaQueryListMock('(min-width: 1024px)');
      const handler = mock.fn();
      mql.onchange = handler;
      mql.addListener(handler);
      mql.removeListener(handler);

      expect(mql.onchange).toBe(handler);
    });

    test('should ignore null callback', () => {
      const mql = new MediaQueryListMock('(min-width: 1024px)');
      mql.addListener(null);
      mql.removeListener(null);

      expect(mql.onchange).toBe(null);
      expect(() => mql.simulateChange({ matches: true })).not.toThrow();
    });
  });
});

describe('MediaQueryListEventMock', () => {
  test('should use init values', () => {
    const event = new MediaQueryListEventMock('change', {
      matches: true,
      media: '(min-width: 1024px)',
    });

    expect(event.type).toBe('change');
    expect(event.matches).toBe(true);
    expect(event.media).toBe('(min-width: 1024px)');
  });

  test('should use defaults when init is omitted', () => {
    const event = new MediaQueryListEventMock('change');

    expect(event.type).toBe('change');
    expect(event.matches).toBe(false);
    expect(event.media).toBe('');
  });
});
