import { expect } from '@std/expect';
import { describe, test } from 'node:test';
import { fireEvent, render } from '@testing-library/react';
import { useState } from 'react';
import { useDebounceState } from '../use-debounce-state.ts';
import { wait } from '../../misc/mod.ts';

function TestComponent() {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounceState(value, 200);

  const handleChange = (event: { target: { value: string } }) => {
    setValue(event.target.value);
  };

  return (
    <>
      <input data-marker='field' value={value} onChange={handleChange} />
      <span data-marker='caption'>{debouncedValue}</span>
    </>
  );
}

describe('useDebounceState', () => {
  test('Should return debounce state', async () => {
    const { getByTestId } = render(<TestComponent />);
    const field = getByTestId('field') as HTMLInputElement;
    const caption = getByTestId('caption');

    // initial state
    expect(field.value).toBe('');
    expect(caption.textContent).toBe('');

    // change input
    fireEvent.change(field, { target: { value: 'something' } });
    expect(field.value).toBe('something');
    expect(caption.textContent).toBe('');

    // wait for debounced state updates
    await wait(300);
    expect(caption.textContent).toBe('something');

    // change input again
    fireEvent.change(field, { target: { value: 'foobar' } });
    expect(field.value).toBe('foobar');
    expect(caption.textContent).toBe('something');

    // wait for debounced state updates
    await wait(300);
    expect(caption.textContent).toBe('foobar');
  });
});
