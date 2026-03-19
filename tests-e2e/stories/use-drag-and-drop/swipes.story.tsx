import { type CSSProperties, type ReactNode, useRef, useState } from 'react';
import { useDragAndDrop } from '@krutoo/utils/react';
import styles from './swipes.m.css';

export const meta = {
  category: 'React hooks/useDragAndDrop',
  title: 'Swipes',
};

export default function Example() {
  const [items, setItems] = useState(() =>
    Array(10)
      .fill(0)
      .map((zero, index) => ({ id: index })),
  );

  const deleteItem = (itemId: number) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className={styles.list}>
      {items.map(item => (
        <Item key={item.id} onDelete={() => deleteItem(item.id)}>{`Item #${item.id}`}</Item>
      ))}
    </div>
  );
}

function Item({ children, onDelete }: { children?: ReactNode; onDelete?: VoidFunction }) {
  const duration = 200;
  const limit = -200;

  const ref = useRef<HTMLDivElement>(null);
  const [grabbed, setGrabbed] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useDragAndDrop(ref, {
    onGrab(event) {
      setGrabbed(true);
      setOffset(event.offset);
    },
    onMove(event) {
      setOffset(event.offset);
    },
    onDrop(event) {
      setGrabbed(false);

      if (event.offset.x < limit) {
        setDeleted(true);
        setTimeout(() => onDelete?.(), duration);
      }
    },
  });

  const draggableStyle: CSSProperties = grabbed
    ? {
        transform: `translateX(${Math.min(0, offset.x)}px)`,
      }
    : {
        transition: `height ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`,

        ...(deleted && {
          height: `0px`,
          transform: `translateX(-100%)`,
        }),
      };

  const rubberStyle: CSSProperties = {
    width: !deleted ? -offset.x : '100%',

    ...(!grabbed && {
      transition: `width ${duration}ms ease-in-out`,
    }),

    ...(offset.x < limit && {
      fontSize: '18px',
      fontWeight: 'bolder',
    }),
  };

  return (
    <div className={styles.item}>
      <div ref={ref} className={styles.draggable} style={draggableStyle}>
        {children}
      </div>
      <div className={styles.rubber} style={rubberStyle}>
        Delete
      </div>
    </div>
  );
}
