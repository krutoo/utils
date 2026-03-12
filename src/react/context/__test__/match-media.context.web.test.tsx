import { describe, mock, test } from 'node:test';
import { useContext, useEffect } from 'react';
import { expect } from '@std/expect';
import { render } from '@testing-library/react';
import { MatchMediaContext } from '../match-media-context.ts';

describe('MatchMediaContext', () => {
  test('should use global matchMedia by default', () => {
    const matchMediaSpy = mock.method(window, 'matchMedia');

    const TestComponent = ({ handleMql }: { handleMql: (mql: MediaQueryList) => void }) => {
      const { matchMedia } = useContext(MatchMediaContext);

      useEffect(() => {
        handleMql(matchMedia('(max-width: 1024px)'));
      }, [handleMql, matchMedia]);

      return <div>Hello</div>;
    };

    const spy = mock.fn();
    expect(matchMediaSpy.mock.callCount()).toBe(0);
    expect(spy.mock.callCount()).toBe(0);

    render(<TestComponent handleMql={spy} />);
    expect(matchMediaSpy.mock.callCount()).toBe(1);
    expect(spy.mock.callCount()).toBe(1);
  });
});
