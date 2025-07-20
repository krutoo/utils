import { CSSProperties, useRef, useState } from 'react';
import { useTransitionStatus, useVisualViewport } from '@krutoo/utils/react';
import { DemoBanner } from '#components/demo-banner/demo-banner.tsx';
import classNames from 'classnames';
import styles from './use-visual-viewport-demo.m.css';
import { useKeydown } from '../../hooks/use-keydown.ts';

function getStubRect() {
  return { width: 0, height: 0, top: 0, left: 0 };
}

export function UseVisualViewportDemo() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(getStubRect);
  const status = useTransitionStatus({ open, duration: 320 });
  const viewport = useVisualViewport();

  const showFrame = () => {
    setOpen(true);
    setRect(bannerRef.current?.getBoundingClientRect() ?? getStubRect());
  };

  const hideFrame = () => {
    setOpen(false);
    setRect(bannerRef.current?.getBoundingClientRect() ?? getStubRect());
  };

  const formatSize = () => {
    return `${Math.floor(viewport.width)} x ${Math.floor(viewport.height)}`;
  };

  const frameStyle: CSSProperties & { [key: `--${string}`]: string | undefined } = {
    '--banner-width': `${rect.width}px`,
    '--banner-height': `${rect.height}px`,
    '--viewport-width': `${viewport.width}px`,
    '--viewport-height': `${viewport.height}px`,
    '--viewport-top': `${viewport.offsetTop}px`,
    '--viewport-left': `${viewport.offsetLeft}px`,
    '--banner-top': `${rect.top}px`,
    '--banner-left': `${rect.left}px`,
  };

  useKeydown(
    () => {
      if (open) {
        hideFrame();
      }
    },
    { key: 'Escape' },
  );

  return (
    <>
      <DemoBanner rootRef={bannerRef} className={styles.banner} onClick={showFrame}>
        {status === 'closed' && (
          <>
            Page viewport size is {formatSize()}
            <span className={styles.subtitle}>Click to see</span>
          </>
        )}
      </DemoBanner>

      {status !== 'closed' && (
        <div
          className={classNames(styles.frame, styles[`frame-${status}`])}
          style={frameStyle}
          onClick={hideFrame}
        >
          {formatSize()}
          <span className={styles.subtitle}>Click to close</span>
        </div>
      )}
    </>
  );
}
