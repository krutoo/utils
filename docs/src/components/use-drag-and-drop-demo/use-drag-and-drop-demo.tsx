import { CSSProperties, useRef, useState } from 'react';
import { useDragAndDrop } from '@krutoo/utils/react';
import { DemoBanner } from '#components/demo-banner/demo-banner.tsx';
import styles from './use-drag-and-drop-demo.m.css';

function getStubPoint() {
  return { x: 0, y: 0 };
}

function Draggable() {
  const ref = useRef<HTMLDivElement>(null);
  const [grabbed, setGrabbed] = useState(false);
  const [dragOffset, setDragOffset] = useState(getStubPoint);

  useDragAndDrop(ref, {
    onGrab(event) {
      setGrabbed(true);
      setDragOffset(event.offset);
    },
    onMove(event) {
      setDragOffset(event.offset);
    },
  });

  const style: CSSProperties = grabbed
    ? {
        position: 'absolute',
        top: `${dragOffset.y}px`,
        left: `${dragOffset.x}px`,
      }
    : {};

  return (
    <div ref={ref} className={styles.block} style={style}>
      <span>
        This block is <b>draggable</b>
      </span>
    </div>
  );
}

export function UseDragAndDropDemo() {
  return (
    <DemoBanner className={styles.banner}>
      <Draggable />
    </DemoBanner>
  );
}
