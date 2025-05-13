import { CSSProperties, useRef } from 'react';
import { useVisualViewport } from '@krutoo/utils/react';

export const meta = {
  category: 'React hooks/useVisualViewport',
  title: 'Stateless mode',
};

export default function Example() {
  const ref = useRef<HTMLDivElement>(null);

  useVisualViewport({
    mode: 'stateless',
    onChange({ offsetTop, offsetLeft, width, height }) {
      if (!ref.current) {
        return;
      }

      ref.current.style.top = `${offsetTop}px`;
      ref.current.style.left = `${offsetLeft}px`;
      ref.current.style.width = `${width}px`;
      ref.current.style.height = `${height}px`;
      ref.current.innerHTML = `Viewport size:<br/>${width.toFixed()}px x ${height.toFixed()}px`;
    },
  });

  const style: CSSProperties = {
    position: 'fixed',
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    boxShadow: 'inset 0 0 0 6px red',
  };

  return <div ref={ref} id='viewport' style={style}></div>;
}
