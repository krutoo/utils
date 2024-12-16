import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { fireEvent, render } from '@testing-library/react';
import { useState } from 'react';
import { useDebounceState } from '../use-debounce-state.ts';
import { wait } from '../../lang/mod.ts';

function TestComponent() {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounceState(value, 200);

  const handleChange = (event: { target: { value: string } }) => {
    setValue(event.target.value);
  };

  return (
    <>
      <input data-testid='field' value={value} onChange={handleChange} />
      <span data-testid='caption'>{debouncedValue}</span>
    </>
  );
}

describe('useDebounceState', () => {
  test('Should return debounce state', async () => {
    const { getByTestId } = render(<TestComponent />);
    const field = getByTestId('field') as HTMLInputElement;
    const caption = getByTestId('caption');

    // initial state
    assert.equal(field.value, '');
    assert.equal(caption.textContent, '');

    // change input
    fireEvent.change(field, { target: { value: 'something' } });
    assert.equal(field.value, 'something');
    assert.equal(caption.textContent, '');

    // wait for debounced state updates
    await wait(250);
    assert.equal(caption.textContent, 'something');

    // change input again
    fireEvent.change(field, { target: { value: 'foobar' } });
    assert.equal(field.value, 'foobar');
    assert.equal(caption.textContent, 'something');

    // wait for debounced state updates
    await wait(250);
    assert.equal(caption.textContent, 'foobar');
  });
});
