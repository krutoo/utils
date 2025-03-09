import { CSSProperties, useRef } from 'react';
import { useDragAndDrop } from '@krutoo/utils/react';
import styles from './primary.m.css';

export const meta = {
  category: 'React/useDragAndDrop',
  title: 'Primary example',
};

export default function Example() {
  const ref = useRef<HTMLDivElement>(null);
  const { captured, offset } = useDragAndDrop(ref);

  const style: CSSProperties = captured
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
