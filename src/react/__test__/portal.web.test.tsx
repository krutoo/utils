import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { fireEvent, render } from '@testing-library/react';
import { useState } from 'react';
import { Portal } from '../portal.tsx';

function TestComponent() {
  const [open, setOpen] = useState(false);

  return (
    <div data-marker='block'>
      <button data-marker='toggle' onClick={() => setOpen(a => !a)}>
        Toggle
      </button>

      {open && (
        <Portal>
          <h1>Hello, world!</h1>
          <p>This content was rendered into new div at end of body.</p>
        </Portal>
      )}
    </div>
  );
}

describe('Portal', () => {
  test('should create container, render content into, remove container', async () => {
    const { baseElement, getByTestId } = render(<TestComponent />);

    expect(baseElement.children.length).toBe(1);
    expect(getByTestId('block').textContent).toContain('Toggle');
    expect(getByTestId('block').textContent).not.toContain('Hello, world!');
    expect(baseElement.textContent).not.toContain('Hello, world!');

    fireEvent.click(getByTestId('toggle'));
    expect(baseElement.children.length).toBe(2);
    expect(getByTestId('block').textContent).toContain('Toggle');
    expect(getByTestId('block').textContent).not.toContain('Hello, world!');
    expect(baseElement.textContent).toContain('Hello, world!');

    fireEvent.click(getByTestId('toggle'));
    expect(baseElement.children.length).toBe(1);
    expect(getByTestId('block').textContent).toContain('Toggle');
    expect(getByTestId('block').textContent).not.toContain('Hello, world!');
    expect(baseElement.textContent).not.toContain('Hello, world!');
  });
});
