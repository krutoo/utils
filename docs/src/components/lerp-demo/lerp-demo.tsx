/* eslint-disable jsdoc/require-jsdoc */
import { lerp } from '@krutoo/utils/math';
import { useResize } from '@krutoo/utils/react';
import { type RefObject, useEffect, useRef, useState } from 'react';
import styles from './lerp-demo.m.css';

function useElementSize<T extends Element>(ref: RefObject<T | null>) {
  const [size, setSize] = useState(() => ({
    width: 0,
    height: 0,
    ready: false,
  }));

  useResize(ref, entry => {
    const { width, height } = entry.target.getBoundingClientRect();

    setSize({
      width,
      height,
      ready: true,
    });
  });

  return size;
}

function useMousePosition<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [state, setState] = useState(() => ({ x: 0, y: 0 }));

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      setState({ x: event.clientX - rect.x, y: event.clientY - rect.y });
    };

    const handleTouchMove = (event: TouchEvent) => {
      const rect = element.getBoundingClientRect();
      const [touch] = event.touches;

      if (!touch) {
        return;
      }

      event.preventDefault();
      setState({ x: touch.clientX - rect.x, y: touch.clientY - rect.y });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('touchstart', handleTouchMove);
    element.addEventListener('touchmove', handleTouchMove);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('touchstart', handleTouchMove);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [ref]);

  return state;
}

function toCssPos(point: { x: number; y: number }) {
  return { left: point.x, top: point.y };
}

export function LerpDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const area = useElementSize(ref);
  const mouseActual = useMousePosition(ref);

  const center = {
    x: area.width / 2,
    y: area.height / 2,
  };

  const mouseDefault = {
    x: center.x + 120,
    y: center.y - 80,
  };

  const mouse = hovered ? mouseActual : mouseDefault;

  const middle = {
    x: lerp(center.x, mouse.x, 0.5),
    y: lerp(center.y, mouse.y, 0.5),
  };

  const rootStyle = {
    backgroundPosition: `${center.x - 1}px  ${center.y - 1}px`,
  };

  return (
    <div
      ref={ref}
      className={styles.canvas}
      style={rootStyle}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.dot} style={toCssPos(center)}>
        <div className={styles.label}>A</div>
      </div>

      <div className={styles.dot} style={toCssPos(mouse)}>
        <div className={styles.label}>B</div>
      </div>

      <div className={styles.dot} style={{ ...toCssPos(middle), background: '#f00' }}>
        <div className={styles.label}>lerp(A, B, 0.5)</div>
      </div>
    </div>
  );
}
