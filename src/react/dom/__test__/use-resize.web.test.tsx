import { type Mock, describe, mock, test } from 'node:test';
import { type ReactNode, useRef, useState } from 'react';
import { expect } from '@std/expect';
import { act, render } from '@testing-library/react';
import { ResizeObserverMock } from '../../../testing/mod.ts';
import {
  ResizeObserverContext,
  type ResizeObserverContextValue,
} from '../resize-observer-context.ts';
import { useResize } from '../use-resize.ts';

function TestComponent({
  children,
  onResize,
  'data-marker': dataMarker,
}: {
  children?: ReactNode;
  onResize?: VoidFunction;
  'data-marker'?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useResize(ref, () => {
    onResize?.();
    setCount(count + 1);
  });

  return (
    <div ref={ref} data-marker={dataMarker}>
      {children}
    </div>
  );
}

describe('useResize', () => {
  test('should use context to create observer', () => {
    const observer = new ResizeObserverMock(() => {});

    const context: ResizeObserverContextValue = {
      getObserver(callback) {
        return observer.addCallback(callback);
      },
    };

    const spy = mock.fn();

    mock.method(observer, 'observe');
    mock.method(observer, 'unobserve');
    mock.method(observer, 'disconnect');

    expect((observer.observe as Mock<() => void>).mock.callCount()).toBe(0);
    expect((observer.unobserve as Mock<() => void>).mock.callCount()).toBe(0);
    expect((observer.disconnect as Mock<() => void>).mock.callCount()).toBe(0);
    expect(spy.mock.callCount()).toBe(0);

    // mount
    const { getByTestId, unmount } = render(
      <ResizeObserverContext value={context}>
        <TestComponent onResize={spy} data-marker='greeting'>
          Hello
        </TestComponent>
      </ResizeObserverContext>,
    );
    expect(getByTestId('greeting').textContent).toBe('Hello');
    expect((observer.observe as Mock<() => void>).mock.callCount()).toBe(1);
    expect((observer.unobserve as Mock<() => void>).mock.callCount()).toBe(0);
    expect((observer.disconnect as Mock<() => void>).mock.callCount()).toBe(0);
    expect(spy.mock.callCount()).toBe(0);

    // resize
    act(() => {
      observer.simulateResize([{ target: getByTestId('greeting') }]);
    });
    expect((observer.observe as Mock<() => void>).mock.callCount()).toBe(1);
    expect((observer.unobserve as Mock<() => void>).mock.callCount()).toBe(0);
    expect((observer.disconnect as Mock<() => void>).mock.callCount()).toBe(0);
    expect(spy.mock.callCount()).toBe(1);

    // unmount
    unmount();
    expect((observer.observe as Mock<() => void>).mock.callCount()).toBe(1);
    expect((observer.unobserve as Mock<() => void>).mock.callCount()).toBe(1);
    expect((observer.disconnect as Mock<() => void>).mock.callCount()).toBe(0);
    expect(spy.mock.callCount()).toBe(1);
  });

  test('should works correctly when multiple components uses it', () => {
    const observer = new ResizeObserverMock(() => {});

    const context: ResizeObserverContextValue = {
      getObserver(callback) {
        return observer.addCallback(callback);
      },
    };

    const spy1 = mock.fn();
    const spy2 = mock.fn();
    const spy3 = mock.fn();

    const { getByTestId } = render(
      <ResizeObserverContext value={context}>
        <TestComponent onResize={spy1} data-marker='foo'>
          Foo
        </TestComponent>
        <TestComponent onResize={spy2} data-marker='bar'>
          Bar
        </TestComponent>
        <TestComponent onResize={spy3} data-marker='baz'>
          Baz
        </TestComponent>
      </ResizeObserverContext>,
    );

    expect(spy1.mock.callCount()).toBe(0);
    expect(spy2.mock.callCount()).toBe(0);
    expect(spy3.mock.callCount()).toBe(0);

    act(() => {
      observer.simulateResize([{ target: getByTestId('foo') }]);
    });
    expect(spy1.mock.callCount()).toBe(1);
    expect(spy2.mock.callCount()).toBe(0);
    expect(spy3.mock.callCount()).toBe(0);

    act(() => {
      observer.simulateResize([{ target: getByTestId('bar') }]);
    });
    expect(spy1.mock.callCount()).toBe(1);
    expect(spy2.mock.callCount()).toBe(1);
    expect(spy3.mock.callCount()).toBe(0);

    act(() => {
      observer.simulateResize([{ target: getByTestId('baz') }]);
    });
    expect(spy1.mock.callCount()).toBe(1);
    expect(spy2.mock.callCount()).toBe(1);
    expect(spy3.mock.callCount()).toBe(1);
  });

  test('should not call callback after destructure', () => {
    const observer = new ResizeObserverMock(() => {});

    const context: ResizeObserverContextValue = {
      getObserver(callback) {
        return observer.addCallback(callback);
      },
    };

    const spy = mock.fn();

    const { getByTestId, unmount } = render(
      <ResizeObserverContext value={context}>
        <TestComponent data-marker='hello' onResize={spy}>
          Hello there!
        </TestComponent>
      </ResizeObserverContext>,
    );
    expect(spy.mock.callCount()).toBe(0);

    const element = getByTestId('hello');

    // resize
    act(() => {
      observer.simulateResize([{ target: element }]);
    });
    expect(spy.mock.callCount()).toBe(1);

    // resize after unmount
    unmount();
    act(() => {
      observer.simulateResize([{ target: element }]);
    });
    expect(spy.mock.callCount()).toBe(1);
  });
});
