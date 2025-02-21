import { expect } from '@std/expect';
import { describe, mock, test } from 'node:test';
import { fireEvent, render } from '@testing-library/react';
import { useMergeRefs } from '../use-merge-refs.ts';
import { createRef, type Ref, type RefCallback, useEffect, useState } from 'react';

export interface TestComponentProps {
  refs: Ref<HTMLDivElement>[];
  refCheck?: VoidFunction;
}

function TestComponent({ refs, refCheck }: TestComponentProps) {
  const [shown, setShown] = useState(true);
  const ref = useMergeRefs<HTMLDivElement>(refs);

  useEffect(() => {
    refCheck?.();
  }, [ref, refCheck]);

  return (
    <>
      <button data-testid='hide' onClick={() => setShown(false)}>
        Hide
      </button>

      {shown && (
        <div ref={ref} data-testid='target'>
          Hello
        </div>
      )}
    </>
  );
}

describe('useMergeRefs', () => {
  test('Should set value to each ref', () => {
    let target: HTMLDivElement | null = null;

    const refObject = createRef<HTMLDivElement>();

    const refCallback: RefCallback<HTMLDivElement> = element => {
      target = element;
    };

    const { getByTestId } = render(<TestComponent refs={[refObject, refCallback]} />);

    expect(target! instanceof HTMLDivElement).toBe(true);
    expect(target === getByTestId('target')).toBe(true);
    expect(refObject.current === getByTestId('target')).toBe(true);

    fireEvent.click(getByTestId('hide'));

    expect(target === null).toBe(true);
    expect(refObject.current === null).toBe(true);
  });

  test('Should not change result ref when array is changed but items are same', () => {
    const ref1 = createRef<HTMLDivElement>();
    const ref2 = createRef<HTMLDivElement>();
    const ref3 = createRef<HTMLDivElement>();
    const spy = mock.fn();

    expect(spy.mock.callCount()).toBe(0);

    const { rerender } = render(<TestComponent refs={[ref1, ref2]} refCheck={spy} />);

    expect(spy.mock.callCount()).toBe(1);

    rerender(<TestComponent refs={[ref1, ref2]} refCheck={spy} />);

    expect(spy.mock.callCount()).toBe(1);

    rerender(<TestComponent refs={[ref1, ref2]} refCheck={spy} />);

    expect(spy.mock.callCount()).toBe(1);

    rerender(<TestComponent refs={[ref1, ref2, ref3]} refCheck={spy} />);

    expect(spy.mock.callCount()).toBe(2);

    rerender(<TestComponent refs={[ref1, ref2, ref3]} refCheck={spy} />);

    expect(spy.mock.callCount()).toBe(2);
  });
});
