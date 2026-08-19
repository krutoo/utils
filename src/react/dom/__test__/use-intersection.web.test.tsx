import { describe, mock, test } from 'node:test';
import { useRef, useState } from 'react';
import { expect } from '@std/expect';
import { act, render } from '@testing-library/react';
import { IntersectionObserverMock } from '../../../testing/mod.ts';
import {
  IntersectionObserverContext,
  type IntersectionObserverContextValue,
} from '../intersection-observer-context.ts';
import { useIntersection } from '../use-intersection.ts';

function TestComponent({ onChange }: { onChange?: VoidFunction }) {
  const ref = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);

  useIntersection(ref, entry => {
    onChange?.();
    setVisible(entry.isIntersecting);
  });

  return (
    <div ref={ref} data-marker='status'>
      {visible ? 'In viewport' : 'Out of viewport'}
    </div>
  );
}

describe('useIntersection', () => {
  test('should call callback on intersection change', () => {
    const observer = new IntersectionObserverMock(() => {});

    const context: IntersectionObserverContextValue = {
      getObserver(callback) {
        return observer.addCallback(callback);
      },
    };

    const { container, getByTestId } = render(
      <IntersectionObserverContext value={context}>
        <TestComponent />
      </IntersectionObserverContext>,
    );
    expect(container.textContent).toBe('Out of viewport');

    act(() => {
      observer.simulateIntersection([
        {
          target: getByTestId('status'),
          isIntersecting: true,
        },
      ]);
    });
    expect(container.textContent).toBe('In viewport');

    act(() => {
      observer.simulateIntersection([
        {
          target: getByTestId('status'),
          isIntersecting: false,
        },
      ]);
    });
    expect(container.textContent).toBe('Out of viewport');
  });

  test('should not call callback after destructure', () => {
    const observer = new IntersectionObserverMock(() => {});

    const context: IntersectionObserverContextValue = {
      getObserver(callback) {
        return observer.addCallback(callback);
      },
    };

    const spy = mock.fn();

    const { getByTestId, unmount } = render(
      <IntersectionObserverContext value={context}>
        <TestComponent onChange={spy} />
      </IntersectionObserverContext>,
    );
    expect(spy.mock.callCount()).toBe(0);

    const element = getByTestId('status');

    act(() => {
      observer.simulateIntersection([
        {
          target: element,
          isIntersecting: true,
        },
      ]);
    });
    expect(spy.mock.callCount()).toBe(1);

    unmount();
    act(() => {
      observer.simulateIntersection([
        {
          target: element,
          isIntersecting: false,
        },
      ]);
    });
    expect(spy.mock.callCount()).toBe(1);
  });
});
