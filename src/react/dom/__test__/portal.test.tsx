import { describe, test } from 'node:test';
import { renderToString } from 'react-dom/server';
import { expect } from '@std/expect';
import { Portal } from '../portal.tsx';

function TestComponent() {
  return (
    <Portal>
      <h1>Hello, world!</h1>
      <p>This content was rendered into new div at end of body.</p>
    </Portal>
  );
}

describe('Portal', () => {
  test('should works on server', async () => {
    expect(() => renderToString(<TestComponent />)).not.toThrow();
  });
});
