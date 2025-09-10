import { CSSProperties, useRef, useState } from 'react';
import { useResize } from '@krutoo/utils/react';

export const meta = {
  title: 'Primary',
  category: 'React hooks/useResize',
};

const styles = {
  widget: {
    padding: '2rem',
    background: '#9b59b6',
    color: '#fff',
    fontSize: '1.5rem',
    textAlign: 'center',
    borderRadius: '1rem',
  } satisfies CSSProperties,
};

export default function Example() {
  const [wide, setWide] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useResize(ref, entry => {
    const size = entry.borderBoxSize[0]?.inlineSize ?? 0;

    setWide(size >= 720);
  });

  return (
    <div ref={ref} style={styles.widget}>
      {wide ? 'I am wide' : 'I am thin'}
    </div>
  );
}
