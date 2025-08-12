import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { useDependentRef } from '../use-dependent-ref.ts';
import { useEffect, type RefObject } from 'react';
import { render } from '@testing-library/react';

describe('useDependentRef', () => {
  test('should work like useRef when no deps provided', () => {
    function TestComponent() {
      const ref = useDependentRef<HTMLDivElement | null>(null);

      useEffect(() => {
        window.dispatchEvent(new CustomEvent('ref/change', { detail: ref }));
      }, [ref]);

      return (
        <div ref={ref} data-marker='test-root'>
          Hello, world!
        </div>
      );
    }

    let ref: RefObject<HTMLDivElement | null> | null = null as any;
    let refChangeCount = 0;

    window.addEventListener('ref/change', event => {
      if (event instanceof CustomEvent) {
        ref = event.detail;
        refChangeCount++;
      }
    });

    expect(refChangeCount).toBe(0);
    expect(ref?.current).toBe(undefined);

    const { getByTestId, rerender } = render(<TestComponent />);
    expect(refChangeCount).toBe(1);
    expect(ref?.current instanceof HTMLElement).toBe(true);
    expect(getByTestId('test-root') === ref?.current).toBe(true);

    rerender(<TestComponent />);
    expect(refChangeCount).toBe(1);
    expect(ref?.current instanceof HTMLElement).toBe(true);
    expect(getByTestId('test-root') === ref?.current).toBe(true);
  });

  test('should return new object when deps changed', () => {
    function TestComponent({ seed }: { seed: number }) {
      const ref = useDependentRef<HTMLDivElement | null>(null, [seed]);

      useEffect(() => {
        window.dispatchEvent(new CustomEvent('ref/change', { detail: ref }));
      }, [ref]);

      return (
        <div ref={ref} data-marker='test-root'>
          Hello, world!
        </div>
      );
    }

    let ref: RefObject<HTMLDivElement | null> | null = null as any;
    let refChangeCount = 0;

    window.addEventListener('ref/change', event => {
      if (event instanceof CustomEvent) {
        ref = event.detail;
        refChangeCount++;
      }
    });

    expect(refChangeCount).toBe(0);
    expect(ref?.current).toBe(undefined);

    // initial render - ref should be filled
    const { getByTestId, rerender } = render(<TestComponent seed={1} />);
    expect(refChangeCount).toBe(1);
    expect(ref?.current instanceof HTMLElement).toBe(true);
    expect(getByTestId('test-root') === ref?.current).toBe(true);

    // deps changed - new ref object
    rerender(<TestComponent seed={2} />);
    expect(refChangeCount).toBe(2);
    expect(ref?.current instanceof HTMLElement).toBe(true);
    expect(getByTestId('test-root') === ref?.current).toBe(true);

    // no deps change - same ref object
    rerender(<TestComponent seed={2} />);
    expect(refChangeCount).toBe(2);
    expect(ref?.current instanceof HTMLElement).toBe(true);
    expect(getByTestId('test-root') === ref?.current).toBe(true);
  });
});
