import { describe, mock, test } from 'node:test';
import { type Ref, type RefCallback, type RefObject, createRef, useEffect, useState } from 'react';
import { expect } from '@std/expect';
import { fireEvent, render } from '@testing-library/react';
import { useMergeRefs } from '../use-merge-refs.ts';

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
      <button data-marker='hide' onClick={() => setShown(false)}>
        Hide
      </button>

      {shown && (
        <div ref={ref} data-marker='target'>
          Hello
        </div>
      )}
    </>
  );
}

describe('useMergeRefs', () => {
  test('should set value to each ref', () => {
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

  test('should not change result ref when array is changed but items are same', () => {
    const ref1 = createRef<HTMLDivElement>();
    const ref2 = createRef<HTMLDivElement>();
    const ref3 = createRef<HTMLDivElement>();
    const spy = mock.fn();

    expect(spy.mock.callCount()).toBe(0);

    const { getByTestId, rerender } = render(<TestComponent refs={[ref1, ref2]} refCheck={spy} />);

    expect(spy.mock.callCount()).toBe(1);

    rerender(<TestComponent refs={[ref1, ref2]} refCheck={spy} />);

    expect(spy.mock.callCount()).toBe(1);

    rerender(<TestComponent refs={[ref1, ref2]} refCheck={spy} />);

    expect(spy.mock.callCount()).toBe(1);

    rerender(<TestComponent refs={[ref1, ref2, ref3]} refCheck={spy} />);

    expect(spy.mock.callCount()).toBe(2);

    rerender(<TestComponent refs={[ref1, ref2, ref3]} refCheck={spy} />);

    expect(spy.mock.callCount()).toBe(2);
    expect(ref1.current === getByTestId('target')).toBe(true);
    expect(ref2.current === getByTestId('target')).toBe(true);
    expect(ref3.current === getByTestId('target')).toBe(true);
  });

  test('should properly cleanup mixed refs list', () => {
    const ref1: RefObject<HTMLDivElement | null> = createRef<HTMLDivElement>();
    const ref2 = mock.fn<RefCallback<HTMLDivElement>>();
    const ref3Cleanup = mock.fn<(a: void) => void>(() => {});
    const ref3 = mock.fn<RefCallback<HTMLDivElement>>(() => {
      return ref3Cleanup;
    });

    const { getByTestId, unmount } = render(<TestComponent refs={[ref1, ref2, ref3]} />);
    const target = getByTestId('target');

    expect(ref1.current === target).toBe(true);

    expect(ref2.mock.calls[0]?.arguments[0] === target).toBe(true);
    expect(ref2.mock.callCount()).toBe(1);

    expect(ref3.mock.callCount()).toBe(1);
    expect(ref3.mock.calls[0]?.arguments[0] === target).toBe(true);
    expect(ref3Cleanup.mock.callCount()).toBe(0);

    unmount();

    expect(ref1.current === null).toBe(true);

    expect(ref2.mock.callCount()).toBe(2);
    expect(ref2.mock.calls[1]?.arguments[0] === null).toBe(true);

    expect(ref3.mock.callCount()).toBe(1);
    expect(ref3Cleanup.mock.callCount()).toBe(1);
  });
});
