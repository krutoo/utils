import { describe, mock, test } from 'node:test';
import { useContext, useEffect } from 'react';
import { expect } from '@std/expect';
import { render } from '@testing-library/react';
import { IntersectionObserverContext } from '../intersection-observer-context.ts';

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
