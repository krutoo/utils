import { describe, mock, test, type Mock } from 'node:test';
import { expect } from '@std/expect';
import { render } from '@testing-library/react';
import { useRef } from 'react';
import { useResize } from '../use-resize.ts';
import { ResizeObserverContext, type ResizeObserverContextValue } from '../mod.ts';

function TestComponent({ onResize }: { onResize?: VoidFunction }) {
  const ref = useRef<HTMLDivElement>(null);

  useResize(ref, () => {
    onResize?.();
  });

  return (
    <div ref={ref} data-marker='greeting'>
      Hello
    </div>
  );
}

describe('useResize', () => {
  test('should use context to create observer', () => {
    const fakeObserver: ResizeObserver = {
      observe: mock.fn(),
      unobserve: mock.fn(),
      disconnect: mock.fn(),
    };

    const contextValue: ResizeObserverContextValue = {
      getObserver() {
        return fakeObserver;
      },
    };

    expect((fakeObserver.observe as Mock<() => void>).mock.callCount()).toBe(0);
    expect((fakeObserver.unobserve as Mock<() => void>).mock.callCount()).toBe(0);
    expect((fakeObserver.disconnect as Mock<() => void>).mock.callCount()).toBe(0);

    const { getByTestId, unmount } = render(
      <ResizeObserverContext value={contextValue}>
        <TestComponent />
      </ResizeObserverContext>,
    );
    expect(getByTestId('greeting').textContent).toBe('Hello');
    expect((fakeObserver.observe as Mock<() => void>).mock.callCount()).toBe(1);
    expect((fakeObserver.unobserve as Mock<() => void>).mock.callCount()).toBe(0);
    expect((fakeObserver.disconnect as Mock<() => void>).mock.callCount()).toBe(0);

    unmount();
    expect((fakeObserver.observe as Mock<() => void>).mock.callCount()).toBe(1);
    expect((fakeObserver.unobserve as Mock<() => void>).mock.callCount()).toBe(1);
    expect((fakeObserver.disconnect as Mock<() => void>).mock.callCount()).toBe(0);
  });
});
