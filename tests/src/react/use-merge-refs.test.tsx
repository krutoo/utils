import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { fireEvent, render } from '@testing-library/react';
import { useMergeRefs } from '@krutoo/utils/react';
import { createRef, useState, type Ref, type RefCallback } from 'react';

function TestComponent({ refs }: { refs: Ref<HTMLDivElement>[] }) {
  const [shown, setShown] = useState(true);
  const ref = useMergeRefs<HTMLDivElement>(refs);

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

    assert(target! instanceof HTMLDivElement);
    assert(target === getByTestId('target'));
    assert(refObject.current === getByTestId('target'));

    fireEvent.click(getByTestId('hide'));

    assert(target === null);
    assert(refObject.current === null);
  });
});
