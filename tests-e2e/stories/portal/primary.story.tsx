import { Portal } from '@krutoo/utils/react';
import { useState } from 'react';

export const meta = {
  category: 'Components/Portal',
  title: 'Primary example',
};

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(a => !a)}>Toggle</button>

      {open && (
        <Portal>
          <h1>Hello, world!</h1>
          <p>This content was rendered into new div at end of body.</p>
        </Portal>
      )}
    </>
  );
}
