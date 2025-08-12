import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { act, render } from '@testing-library/react';
import { useIntersection } from '../use-intersection.ts';
import { useRef, useState } from 'react';
import { IntersectionObserverContext, type IntersectionObserverContextValue } from '../mod.ts';
import { IntersectionObserverMock } from '../../testing/mod.ts';

function TestComponent() {
  const ref = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);

  useIntersection(ref, entry => {
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
    let observer: IntersectionObserverMock | null = null;

    const context: IntersectionObserverContextValue = {
      getObserver(callback, options) {
        observer = new IntersectionObserverMock(callback, options);

        return observer;
      },
    };

    const { container, getByTestId } = render(
      <IntersectionObserverContext value={context}>
        <TestComponent />
      </IntersectionObserverContext>,
    );
    expect(container.textContent).toBe('Out of viewport');

    act(() => {
      observer?.simulateIntersection([
        {
          target: getByTestId('status'),
          isIntersecting: true,
        },
      ]);
    });
    expect(container.textContent).toBe('In viewport');

    act(() => {
      observer?.simulateIntersection([
        {
          target: getByTestId('status'),
          isIntersecting: false,
        },
      ]);
    });
    expect(container.textContent).toBe('Out of viewport');
  });
});
