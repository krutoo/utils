import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { render } from '@testing-library/react';
import { useTransitionStatus } from '../use-transition-status.ts';
import { wait } from '../../mod.ts';

function TestWidget({ open, onRender }: { open: boolean; onRender?: (status: string) => void }) {
  const status = useTransitionStatus({
    open,
    duration: 200,
  });

  onRender?.(status);

  if (status === 'closed') {
    return null;
  }

  return (
    <div className={`widget-${status}`} data-marker='widget'>
      Hello
    </div>
  );
}

describe('useTransitionStatus', () => {
  test('should correctly change status', async () => {
    const spy = mock.fn();
    const { queryAllByTestId, rerender } = render(
      //
      <TestWidget open={false} onRender={spy} />,
    );
    expect(queryAllByTestId('widget')).toHaveLength(0);
    expect(spy.mock.callCount()).toBe(1);
    expect(spy.mock.calls[0]?.arguments).toEqual(['closed']);

    rerender(
      //
      <TestWidget open={true} onRender={spy} />,
    );
    expect(queryAllByTestId('widget')).toHaveLength(1);
    expect(spy.mock.callCount()).toBe(3);
    expect(spy.mock.calls[1]?.arguments).toEqual(['closed']);
    expect(spy.mock.calls[2]?.arguments).toEqual(['pre-opening']);

    await wait(300);
    expect(spy.mock.callCount()).toBe(5);
    expect(spy.mock.calls[3]?.arguments).toEqual(['opening']);
    expect(spy.mock.calls[4]?.arguments).toEqual(['open']);
  });
});
