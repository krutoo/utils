import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { useContext, useEffect } from 'react';
import { IntersectionObserverContext } from '../intersection-observer-context.ts';
import { render } from '@testing-library/react';

describe('IntersectionObserverContext', () => {
  test('should use global IntersectionObserver by default', () => {
    const TestComponent = ({
      handleObserver,
    }: {
      handleObserver: (observer: IntersectionObserver) => void;
    }) => {
      const { getObserver } = useContext(IntersectionObserverContext);

      useEffect(() => {
        handleObserver(getObserver(() => {}));
      }, [handleObserver, getObserver]);

      return <div>Hello</div>;
    };

    const spy = mock.fn();

    render(<TestComponent handleObserver={spy} />);
    expect(spy.mock.callCount()).toBe(1);
    expect(spy.mock.calls[0]?.arguments[0] instanceof IntersectionObserver).toBe(true);
  });
});
