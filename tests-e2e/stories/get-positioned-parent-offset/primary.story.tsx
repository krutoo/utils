import {
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { type Point2d, getPositionedParentOffset } from '@krutoo/utils';
import classNames from 'classnames';
import styles from './primary.m.css';

export const meta = {
  title: 'Primary example',
  category: 'DOM/getPositionedParentOffset',
};

const SettingsContext = createContext<{ enabled: boolean }>({
  enabled: false,
});

export default function Example() {
  const [enabled, setEnabled] = useState(false);

  const handleToggle = (event: { target: { checked: boolean } }) => {
    setEnabled(event.target.checked);
  };

  return (
    <SettingsContext value={{ enabled }}>
      <div className={styles.root}>
        <h1 className={styles.title}>getPositionedParentOffset</h1>

        <p className={styles.message}>The page is scrollable</p>

        <p className={styles.message}>
          <label>
            <input type='checkbox' name='enabled' checked={enabled} onChange={handleToggle} />{' '}
            Enabled
          </label>
        </p>

        <Target strategy='fixed'>A_____</Target>
        <Target strategy='absolute'>_A____</Target>

        <Container heading='position: fixed' className={styles.fixed}>
          <Target strategy='fixed'>__A___</Target>
          <Target strategy='absolute'>___A__</Target>
        </Container>

        <Container heading='contain: layout' className={styles.contain}>
          <Target strategy='fixed'>____A_</Target>
          <Target strategy='absolute'>_____A</Target>
        </Container>
      </div>
    </SettingsContext>
  );
}

function Container({
  heading,
  children,
  className,
  ...restProps
}: HTMLAttributes<HTMLDivElement> & { heading?: ReactNode }) {
  return (
    <div className={classNames(styles.container, className)} {...restProps}>
      {heading && <div className={styles.containerHeader}>{heading}</div>}
      <div className={styles.containerBody}>{children}</div>
    </div>
  );
}

function Target({
  children,
  className,
  style,
  strategy = 'absolute',
  ...restProps
}: HTMLAttributes<HTMLDivElement> & { strategy?: 'fixed' | 'absolute' }) {
  const { enabled } = useContext(SettingsContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || !enabled) {
      return;
    }

    const setPosition = (mouse: Point2d) => {
      const offset = getPositionedParentOffset(element, { strategy });
      const size = element.getBoundingClientRect();
      element.style.position = strategy;
      element.style.left = `${mouse.x - offset.x - size.width / 2}px`;
      element.style.top = `${mouse.y - offset.y - size.height / 2}px`;
    };

    const listener = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    setPosition({ x: 0, y: 0 });

    window.addEventListener('mousemove', listener);

    return () => {
      window.removeEventListener('mousemove', listener);
      element.style.position = '';
    };
  }, [enabled]);

  return (
    <div
      ref={ref}
      className={classNames(styles.target, className)}
      style={{ top: 0, left: 0, ...style }}
      data-marker='target'
      {...restProps}
    >
      {children}
    </div>
  );
}
