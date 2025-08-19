import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { render } from '@testing-library/react';
import { useMounted } from '../use-mounted.ts';

interface TestComponentProps {
  logger: {
    render: (details: { mounted: boolean }) => void;
  };
}

function TestComponent({ logger }: TestComponentProps) {
  const mounted = useMounted();

  logger.render({ mounted });

  return <div>{mounted ? 'Mounted' : 'Not mounted'}</div>;
}

describe('useMounted', () => {
  test('should return false by default and true after mount', () => {
    const logger = {
      render: mock.fn(),
    };

    const { container, rerender } = render(<TestComponent logger={logger} />);

    expect(container.textContent).toBe('Mounted');
    expect(logger.render.mock.callCount()).toBe(2);
    expect(logger.render.mock.calls[0]?.arguments[0].mounted).toBe(false);
    expect(logger.render.mock.calls[1]?.arguments[0].mounted).toBe(true);

    rerender(<TestComponent logger={logger} />);
    expect(container.textContent).toBe('Mounted');
    expect(logger.render.mock.callCount()).toBe(3);
    expect(logger.render.mock.calls[2]?.arguments[0].mounted).toBe(true);
  });
});
