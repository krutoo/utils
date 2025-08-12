import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { render } from '@testing-library/react';
import { ErrorBoundary } from '../error-boundary.tsx';

interface TestComponentProps {
  renderFail?: boolean;
}

function TestComponent({ renderFail = false }: TestComponentProps) {
  if (renderFail) {
    throw new Error('Fake error during render');
  }

  return <div>Test component</div>;
}

describe('ErrorBoundary', () => {
  test('should handle render error', () => {
    const onError = mock.fn();
    const fallback = <>Fallback</>;

    const { container, rerender } = render(
      <ErrorBoundary fallback={fallback} onError={onError}>
        <TestComponent />
      </ErrorBoundary>,
    );

    expect(container.textContent).toBe('Test component');
    expect(onError.mock.callCount()).toBe(0);

    rerender(
      <ErrorBoundary fallback={fallback} onError={onError}>
        <TestComponent renderFail />
      </ErrorBoundary>,
    );

    expect(container.textContent).toBe('Fallback');
    expect(onError.mock.callCount()).toBe(1);
    expect(onError.mock.calls[0]?.arguments[0]).toEqual(new Error('Fake error during render'));
  });
});
