import { useVisualViewport } from '@krutoo/utils/react';
import { CSSProperties } from 'react';

export const meta = {
  category: 'React hooks/useVisualViewport',
  title: 'Primary example',
};

export default function Example() {
  const viewport = useVisualViewport();

  const style: CSSProperties = {
    position: 'fixed',
    top: viewport.offsetTop,
    left: viewport.offsetLeft,
    width: viewport.width,
    height: viewport.height,
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    boxShadow: 'inset 0 0 0 6px red',
  };

  return (
    <div style={style}>
      Viewport size:
      <br />
      {viewport.width.toFixed()}px x {viewport.height.toFixed()}px
    </div>
  );
}
