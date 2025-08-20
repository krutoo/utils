import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';
import { useOutsideClick } from '../use-outside-click.ts';

interface TestComponentProps {
  logger: {
    click(): void;
  };
}

function TestComponent({ logger }: TestComponentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    logger.click();
  });

  return (
    <div ref={ref} data-marker='greeting'>
      Hello
    </div>
  );
}

describe('useOutsideClick', () => {
  test('should call listener on outside click', () => {
    const logger = {
      click: mock.fn(),
    };

    const { getByTestId } = render(
      <>
        <div data-marker='neighbor'>I am neighbor</div>
        <TestComponent logger={logger} />
      </>,
    );
    expect(logger.click.mock.callCount()).toBe(0);

    fireEvent.click(getByTestId('greeting'));
    expect(logger.click.mock.callCount()).toBe(0);

    fireEvent.click(getByTestId('neighbor'));
    expect(logger.click.mock.callCount()).toBe(1);

    fireEvent.click(getByTestId('neighbor'));
    expect(logger.click.mock.callCount()).toBe(2);
  });
});
