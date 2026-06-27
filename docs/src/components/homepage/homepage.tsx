import { MouseEvent, useContext, useEffect, useRef, useState } from 'react';
import { ColorSchemesContext } from '@krutoo/showcase/runtime-showcase';
import { wait } from '@krutoo/utils';
import { useNavigate, useResize } from '@krutoo/utils/react';
import classNames from 'classnames';
import { Check, Copy } from 'lucide-react';
import { DemoDots } from './demo-dots.ts';
import styles from './homepage.m.css';

export function Homepage() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [size, setSize] = useState(() => ({ width: 0, height: 0 }));
  const content = 'npm add @krutoo/utils';
  const { colorScheme } = useContext(ColorSchemesContext);

  const handleCopy = () => {
    if (!copied) {
      navigator.clipboard
        .writeText(content)
        .then(() => setCopied(true))
        .catch(() => {});
    }
  };

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.currentTarget.target !== '_blank') {
      event.preventDefault();
      navigate(event.currentTarget.href);
    }
  };

  useResize(rootRef, ({ target }) => {
    const { width, height } = target.getBoundingClientRect();

    setSize({ width, height });
  });

  useEffect(() => {
    if (copied) {
      wait(2000).then(() => setCopied(false));
    }
  }, [copied]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext?.('2d');

    if (!canvas || !context) {
      return;
    }

    const mouse = {
      x: canvas.width / 2,
      y: canvas.height / 2,
    };

    window.addEventListener('mousemove', event => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    });

    const demoCtx = {
      canvas,
      context,
      mouse,
      colorScheme,
    };
    const demo = new DemoDots(demoCtx);

    let last = Date.now();
    let enabled = true;

    const loop = () => {
      const now = Date.now();
      const delta = now - last;

      if (delta > 1000 / 60) {
        last = now;
        demo.update(demoCtx);
        context.clearRect(0, 0, canvas.width, canvas.height);
        demo.render(demoCtx);
      }

      if (enabled) {
        requestAnimationFrame(loop);
      }
    };

    loop();

    return () => {
      enabled = false;
    };
  }, [size, colorScheme]);

  return (
    <div ref={rootRef} className={styles.root}>
      <canvas ref={canvasRef} className={styles.canvas} {...size}></canvas>
      <div className={styles.main}>
        <div className={styles.field}>
          <span className={styles.fieldContent}>{content}</span>
          <button
            className={styles.fieldButton}
            disabled={copied}
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy'}
          >
            {copied ? <Check size={24} /> : <Copy size={24} />}
          </button>
        </div>
        <div className={styles.links}>
          <a
            className={classNames(styles.link, 'appearance-button')}
            href='?path=/about'
            onClick={handleLinkClick}
          >
            Docs
          </a>
          <a
            className={classNames(styles.link, styles.secondary, 'appearance-button')}
            href='https://github.com/krutoo/utils'
            target='_blank'
            rel='noreferrer'
            onClick={handleLinkClick}
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
