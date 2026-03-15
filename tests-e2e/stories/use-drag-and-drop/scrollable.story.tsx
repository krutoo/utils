import { CSSProperties, useRef, useState } from 'react';
import { findClosest, isScrollable } from '@krutoo/utils';
import { DragAndDropEvent, useDragAndDrop } from '@krutoo/utils/react';
import styles from './scrollable.m.css';

export const meta = {
  category: 'React hooks/useDragAndDrop',
  title: 'Scrollable content',
};

/**
 * Returns true when element vertically scrolled to top or bottom edge.
 * @param element Element.
 * @returns Boolean.
 */
export function isScrolledToBoundsY(element: Element): boolean {
  return !(
    element.scrollTop > 0 && element.scrollTop + element.clientHeight < element.scrollHeight
  );
}

export default function Example() {
  const ref = useRef<HTMLDivElement>(null);
  const [moved, setMoved] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const needPreventGrab = (event: DragAndDropEvent<PointerEvent>): boolean => {
    if (event.nativeEvent.target instanceof Element) {
      const scrollableChild = findClosest(event.nativeEvent.target, isScrollable, {
        needBreakLoop: el => el === event.target,
      });

      if (scrollableChild) {
        return event.nativeEvent.pointerType === 'touch';
      }
    }

    return false;
  };

  useDragAndDrop(ref, {
    onGrab(event) {
      if (needPreventGrab(event)) {
        return event.preventDefault();
      }

      setMoved(true);
      setOffset(event.offset);
    },
    onMove(event) {
      setMoved(true);
      setOffset(event.offset);
    },
    onDrop() {},
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
      <div ref={ref} style={style} className={styles.draggable}>
        ⠿ This block is draggable
        <div className={styles.scrollable}>
          <SomeArticle />
        </div>
      </div>
    </div>
  );
}

function SomeArticle() {
  return (
    <>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab eius voluptas debitis!</p>
      <p>
        At architecto saepe ducimus cum error repellendus illo, libero impedit vero praesentium?
      </p>
      <p>
        Sapiente, assumenda! Incidunt aspernatur a sint cupiditate porro, id inventore
        exercitationem repudiandae.
      </p>
      <p>Asperiores autem ad dolore minus eaque enim tenetur perferendis quam. Explicabo, rerum?</p>
      <p>
        Beatae odit consequatur sapiente cupiditate facere dolorum obcaecati ipsum eos eligendi at.
      </p>
      <p>Iste suscipit rerum minus, iure natus harum eius tenetur fugit aspernatur earum?</p>
      <p>
        Corrupti dolorem cupiditate nesciunt cum aspernatur dolores fugiat nostrum aperiam neque
        reiciendis!
      </p>
      <p>
        Nobis maxime incidunt adipisci fugiat perferendis placeat explicabo tempora expedita eos
        officia.
      </p>
      <p>Dicta, beatae. Nisi recusandae qui ratione doloribus minima vitae accusantium ut eius?</p>
      <p>Quo consequatur culpa vitae facere illo aliquam temporibus a similique tenetur! Vitae.</p>
    </>
  );
}
