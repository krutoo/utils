import { type CSSProperties, useRef, useState } from 'react';
import { useIntersection } from '@krutoo/utils/react';

export const meta = {
  category: 'React hooks/useIntersection',
  title: 'Primary example',
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  } satisfies CSSProperties,

  item: {
    height: '100px',
    borderRadius: '12px',
    transition: 'background 500ms ease-in-out',
  } satisfies CSSProperties,
};

function Item() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useIntersection(ref, entry => {
    setVisible(entry.isIntersecting);
  });

  const style: CSSProperties = {
    ...styles.item,
    background: visible ? '#1abc9c' : '#2c3e50',
  };

  return <div ref={ref} style={style}></div>;
}

export default function Example() {
  const items = [...Array(100).keys()];

  return (
    <>
      <div style={styles.container}>
        <h1>Blocks that are in viewport will be green</h1>
        <p>Scroll the page for see effect</p>
        {items.map(itemId => (
          <Item key={itemId} />
        ))}
      </div>
    </>
  );
}
