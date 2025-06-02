import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { act, render } from '@testing-library/react';
import { useVisualViewport } from '../use-visual-viewport.ts';
import { VisualViewportContext } from '../mod.ts';
import { VisualViewportMock } from '../../testing/mod.ts';

function TestComponent() {
  const viewport = useVisualViewport();

  return (
    <ul>
      <li>width: {viewport.width}</li>
      <li>height: {viewport.height}</li>
      <li>scale: {viewport.scale}</li>
      <li>pageLeft: {viewport.pageLeft}</li>
      <li>pageTop: {viewport.pageTop}</li>
      <li>offsetLeft: {viewport.offsetLeft}</li>
      <li>offsetTop: {viewport.offsetTop}</li>
    </ul>
  );
}

describe('useVisualViewport', () => {
  test('should sync returned state with viewport', () => {
    const viewport = new VisualViewportMock({
      width: 1024,
      height: 768,
      scale: 1.1,
      offsetLeft: 10,
      offsetTop: 20,
      pageLeft: 30,
      pageTop: 40,
    });

    const context = {
      getVisualViewport: () => viewport,
    };

    const { container } = render(
      <VisualViewportContext value={context}>
        <TestComponent />
      </VisualViewportContext>,
    );

    expect(container.textContent).toContain('width: 1024');
    expect(container.textContent).toContain('height: 768');
    expect(container.textContent).toContain('scale: 1.1');
    expect(container.textContent).toContain('offsetLeft: 10');
    expect(container.textContent).toContain('offsetTop: 20');
    expect(container.textContent).toContain('pageLeft: 30');
    expect(container.textContent).toContain('pageTop: 40');

    act(() => {
      viewport.simulateResize({ width: 1280, height: 800 });
    });
    expect(container.textContent).toContain('width: 1280');
    expect(container.textContent).toContain('height: 800');

    act(() => {
      viewport.simulateScroll({ pageLeft: 200, pageTop: 300 });
    });
    expect(container.textContent).toContain('pageLeft: 200');
    expect(container.textContent).toContain('pageTop: 300');
  });
});
