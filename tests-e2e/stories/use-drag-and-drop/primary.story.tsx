import { CSSProperties, useRef, useState } from 'react';
import { useDragAndDrop } from '@krutoo/utils/react';
import styles from './primary.m.css';

export const meta = {
  category: 'React hooks/useDragAndDrop',
  title: 'Primary example',
};

export default function Example() {
  const ref = useRef<HTMLDivElement>(null);
  const [grabbed, setGrabbed] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useDragAndDrop(ref, {
    onGrab(event) {
      setGrabbed(true);
      setOffset(event.offset);
    },
    onMove(event) {
      setOffset(event.offset);
    },
    onDrop() {
      setGrabbed(false);
    },
  });

  const style: CSSProperties = grabbed
    ? {
        position: 'absolute',
        left: offset.x,
        top: offset.y,
      }
    : {};

  return (
    <div className={style.container}>
      <div ref={ref} style={style} className={styles.draggable}>
        This block is draggable
      </div>
    </div>
  );
}
