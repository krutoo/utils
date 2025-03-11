import { Portal } from '@krutoo/utils/react';
import { useState } from 'react';

export const meta = {
  category: 'React components/Portal',
  title: 'Render into existing element',
};

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(a => !a)}>Toggle</button>

      {open && (
        <Portal container={() => document.querySelector('footer')!}>
          <h1>Hello, world!</h1>
          <p>This content was rendered to existing page footer.</p>
        </Portal>
      )}

      <footer></footer>
    </>
  );
}
