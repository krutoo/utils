import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import { render } from '@testing-library/react';
import { useIdentityRef } from '../use-identity-ref.ts';
import { useEffect } from 'react';

interface TestComponentProps {
  value: number;
  onRefChange?: VoidFunction;
}

function TestComponent({ value, onRefChange }: TestComponentProps) {
  const ref = useIdentityRef<number>(value);

  useEffect(() => {
    onRefChange?.();
  }, [ref, onRefChange]);

  return <div data-testid='display'>Ref value: {ref.current}</div>;
}

describe('useIdentityRef', () => {
  test('should return stable ref with actual value', () => {
    let refChangeCount = 0;

    const handleRefChange = () => {
      refChangeCount++;
    };

    const { getByTestId, rerender } = render(
      <TestComponent value={1} onRefChange={handleRefChange} />,
    );

    const display = getByTestId('display');
    assert.equal(display.textContent, 'Ref value: 1');
    assert.equal(1, refChangeCount);

    rerender(<TestComponent value={12} onRefChange={handleRefChange} />);
    assert.equal(display.textContent, 'Ref value: 12');
    assert.equal(1, refChangeCount);

    rerender(<TestComponent value={123} onRefChange={handleRefChange} />);
    assert.equal(display.textContent, 'Ref value: 123');
    assert.equal(1, refChangeCount);
  });
});
