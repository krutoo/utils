import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { useContext, useEffect } from 'react';
import { ResizeObserverContext } from '../resize-observer-context.ts';
import { render } from '@testing-library/react';

describe('ResizeObserverContext', () => {
  test('should use global ResizeObserver by default', () => {
    const TestComponent = ({
      handleObserver,
    }: {
      handleObserver: (observer: ResizeObserver) => void;
    }) => {
      const { getObserver } = useContext(ResizeObserverContext);

      useEffect(() => {
        handleObserver(getObserver(() => {}));
      }, [handleObserver, getObserver]);

      return <div>Hello</div>;
    };

    const spy = mock.fn();

    render(<TestComponent handleObserver={spy} />);
    expect(spy.mock.callCount()).toBe(1);
    expect(spy.mock.calls[0]?.arguments[0] instanceof ResizeObserver).toBe(true);
  });
});
