import { CSSProperties, useRef, useState } from 'react';
import { useDragAndDrop } from '@krutoo/utils/react';
import styles from './primary.m.css';

export const meta = {
  category: 'React hooks/useDragAndDrop',
  title: 'Primary example',
};

export default function Example() {
  const ref = useRef<HTMLDivElement>(null);
  const [moved, setMoved] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useDragAndDrop(ref, {
    onGrab(event) {
      setOffset(event.offset);
    },
    onMove(event) {
      setMoved(true);
      setOffset(event.offset);
    },
  });

  const style: CSSProperties = moved
    ? {
        position: 'absolute',
        left: offset.x,
        top: offset.y,
      }
    : {};

  return (
    <div className={style.container}>
      <div ref={ref} style={style} className={styles.draggable} data-marker='draggable'>
        This block is draggable
        <div className={styles.actions}>
          <button onClick={() => alert('Button clicked!')}>Button</button>
          <a href='https://www.google.com' target='_blank' rel='noreferrer'>
            Link
          </a>
        </div>
      </div>
    </div>
  );
}
