import { test, describe } from 'node:test';
import { render } from '@testing-library/react';
import { useLatestRef } from '../use-latest-ref.ts';
import { useEffect } from 'react';
import { expect } from '@std/expect';

interface TestComponentProps {
  value: number;
  onRefChange?: VoidFunction;
}

function TestComponent({ value, onRefChange }: TestComponentProps) {
  const ref = useLatestRef<number>(value);

  useEffect(() => {
    onRefChange?.();
  }, [ref, onRefChange]);

  return <div data-marker='display'>Ref value: {ref.current}</div>;
}

describe('useLatestRef', () => {
  test('should return stable ref with actual value', () => {
    let refChangeCount = 0;

    const handleRefChange = () => {
      refChangeCount++;
    };

    const { getByTestId, rerender } = render(
      <TestComponent value={1} onRefChange={handleRefChange} />,
    );

    const display = getByTestId('display');
    expect(display.textContent).toBe('Ref value: 1');
    expect(refChangeCount).toBe(1);

    rerender(<TestComponent value={12} onRefChange={handleRefChange} />);
    expect(display.textContent).toBe('Ref value: 12');
    expect(refChangeCount).toBe(1);

    rerender(<TestComponent value={123} onRefChange={handleRefChange} />);
    expect(display.textContent).toBe('Ref value: 123');
    expect(refChangeCount).toBe(1);
  });
});
