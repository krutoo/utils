import { type Mock, describe, mock, test } from 'node:test';
import { useRef, useState } from 'react';
import { expect } from '@std/expect';
import { act, render } from '@testing-library/react';
import { IntersectionObserverMock } from '../../../testing/intersection-observer-mock.ts';
import {
  IntersectionObserverContext,
  type IntersectionObserverContextValue,
} from '../intersection-observer-context.ts';
import { useIntersection } from '../use-intersection.ts';

function TestComponent({ disabled, onChange }: { disabled?: boolean; onChange?: VoidFunction }) {
  const ref = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);

  useIntersection(
    ref,
    entry => {
      onChange?.();
      setVisible(entry.isIntersecting);
    },
    { disabled },
  );

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

  test('should not observe when disabled and resume when enabled', () => {
    const observer = new IntersectionObserverMock(() => {});

    const context: IntersectionObserverContextValue = {
      getObserver(callback) {
        return observer.addCallback(callback);
      },
    };

    const spy = mock.fn();

    mock.method(observer, 'observe');
    mock.method(observer, 'unobserve');

    const observeMock = observer.observe as Mock<() => void>;
    const unobserveMock = observer.unobserve as Mock<() => void>;

    // disabled at mount
    const { getByTestId, rerender, unmount } = render(
      <IntersectionObserverContext value={context}>
        <TestComponent onChange={spy} disabled />
      </IntersectionObserverContext>,
    );
    const element = getByTestId('status');

    expect(observeMock.mock.callCount()).toBe(0);
    expect(unobserveMock.mock.callCount()).toBe(0);
    expect(spy.mock.callCount()).toBe(0);

    act(() => {
      observer.simulateIntersection([
        {
          target: element,
          isIntersecting: true,
        },
      ]);
    });
    expect(spy.mock.callCount()).toBe(0);

    // enabled
    rerender(
      <IntersectionObserverContext value={context}>
        <TestComponent onChange={spy} disabled={false} />
      </IntersectionObserverContext>,
    );
    expect(observeMock.mock.callCount()).toBe(1);
    expect(unobserveMock.mock.callCount()).toBe(0);

    act(() => {
      observer.simulateIntersection([
        {
          target: element,
          isIntersecting: true,
        },
      ]);
    });
    expect(spy.mock.callCount()).toBe(1);

    // disabled again
    rerender(
      <IntersectionObserverContext value={context}>
        <TestComponent onChange={spy} disabled />
      </IntersectionObserverContext>,
    );
    expect(observeMock.mock.callCount()).toBe(1);
    expect(unobserveMock.mock.callCount()).toBe(1);

    act(() => {
      observer.simulateIntersection([
        {
          target: element,
          isIntersecting: false,
        },
      ]);
    });
    expect(spy.mock.callCount()).toBe(1);

    unmount();
  });
});
