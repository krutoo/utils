import { describe, mock, test, type Mock } from 'node:test';
import { expect } from '@std/expect';
import { render } from '@testing-library/react';
import { useRef } from 'react';
import { useResize } from '../use-resize.ts';
import { ResizeObserverContext, type ResizeObserverContextValue } from '../mod.ts';
import { ResizeObserverMock } from '../../testing/mod.ts';

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
    const observer = new ResizeObserverMock(() => {});

    mock.method(observer, 'observe');
    mock.method(observer, 'unobserve');
    mock.method(observer, 'disconnect');

    const context: ResizeObserverContextValue = {
      getObserver() {
        return observer;
      },
    };

    expect((observer.observe as Mock<() => void>).mock.callCount()).toBe(0);
    expect((observer.unobserve as Mock<() => void>).mock.callCount()).toBe(0);
    expect((observer.disconnect as Mock<() => void>).mock.callCount()).toBe(0);

    const { getByTestId, unmount } = render(
      <ResizeObserverContext value={context}>
        <TestComponent />
      </ResizeObserverContext>,
    );
    expect(getByTestId('greeting').textContent).toBe('Hello');
    expect((observer.observe as Mock<() => void>).mock.callCount()).toBe(1);
    expect((observer.unobserve as Mock<() => void>).mock.callCount()).toBe(0);
    expect((observer.disconnect as Mock<() => void>).mock.callCount()).toBe(0);

    unmount();
    expect((observer.observe as Mock<() => void>).mock.callCount()).toBe(1);
    expect((observer.unobserve as Mock<() => void>).mock.callCount()).toBe(1);
    expect((observer.disconnect as Mock<() => void>).mock.callCount()).toBe(0);
  });
});
