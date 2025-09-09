import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { useStorageItem } from '../use-storage-item.ts';
import { fireEvent, render } from '@testing-library/react';

describe('useStorageItem', () => {
  test('should works correctly without processor', () => {
    function TestComponent() {
      const [state, setState] = useStorageItem('money', {
        storage: localStorage,
      });

      return (
        <>
          <div data-marker='display'>Value: {state ?? '[empty]'}</div>
          <button onClick={() => setState('100$')}>Set 100$</button>
          <button onClick={() => setState('250€')}>Set 250€</button>
          <button onClick={() => setState(null)}>Reset value</button>
        </>
      );
    }

    expect(localStorage.getItem('money')).toBe(null);

    const { getByTestId, getByText } = render(<TestComponent />);
    expect(getByTestId('display').textContent).toBe('Value: [empty]');
    expect(localStorage.getItem('money')).toBe(null);

    fireEvent.click(getByText('Set 100$'));
    expect(getByTestId('display').textContent).toBe('Value: 100$');
    expect(localStorage.getItem('money')).toBe('100$');

    fireEvent.click(getByText('Set 250€'));
    expect(getByTestId('display').textContent).toBe('Value: 250€');
    expect(localStorage.getItem('money')).toBe('250€');

    fireEvent.click(getByText('Reset value'));
    expect(localStorage.getItem('money')).toBe(null);
    expect(getByTestId('display').textContent).toBe('Value: [empty]');
  });

  test('should works when storage is a function', () => {
    function TestComponent() {
      const [state, setState] = useStorageItem('distance', {
        storage: () => localStorage,
      });

      return (
        <>
          <div data-marker='display'>Distance: {state ?? '[empty]'}</div>
          <button onClick={() => setState('10px')}>10px</button>
          <button onClick={() => setState('25px')}>25px</button>
          <button onClick={() => setState(null)}>Reset</button>
        </>
      );
    }

    expect(localStorage.getItem('distance')).toBe(null);

    const { getByTestId, getByText } = render(<TestComponent />);
    expect(localStorage.getItem('distance')).toBe(null);
    expect(getByTestId('display').textContent).toBe('Distance: [empty]');

    fireEvent.click(getByText('10px'));
    expect(getByTestId('display').textContent).toBe('Distance: 10px');
    expect(localStorage.getItem('distance')).toBe('10px');

    fireEvent.click(getByText('25px'));
    expect(getByTestId('display').textContent).toBe('Distance: 25px');
    expect(localStorage.getItem('distance')).toBe('25px');

    fireEvent.click(getByText('Reset'));
    expect(localStorage.getItem('distance')).toBe(null);
    expect(getByTestId('display').textContent).toBe('Distance: [empty]');
  });
});
