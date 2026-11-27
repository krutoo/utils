import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { VisualViewportMock, type VisualViewportValues } from '../visual-viewport-mock.ts';

const defaultValues: VisualViewportValues = {
  width: 1280,
  height: 720,
  scale: 1,
  offsetLeft: 0,
  offsetTop: 0,
  pageLeft: 0,
  pageTop: 0,
};

function expectValues(viewport: VisualViewportMock, values: VisualViewportValues): void {
  for (const [key, value] of Object.entries(values)) {
    expect(viewport[key as keyof VisualViewportValues]).toBe(value);
  }
}

describe('VisualViewportMock', () => {
  describe('defaults', () => {
    test('should use default size, position and scale values', () => {
      expectValues(new VisualViewportMock(), defaultValues);
    });

    test('should override only provided values', () => {
      expectValues(new VisualViewportMock({ width: 1024, pageLeft: 10, scale: 1.5 }), {
        ...defaultValues,
        width: 1024,
        pageLeft: 10,
        scale: 1.5,
      });
    });

    test('should use falsy values passed as defaults', () => {
      expectValues(
        new VisualViewportMock({
          width: 0,
          height: 0,
          scale: 0,
          offsetLeft: -10,
          offsetTop: -20,
          pageLeft: -30,
          pageTop: -40,
        }),
        {
          width: 0,
          height: 0,
          scale: 0,
          offsetLeft: -10,
          offsetTop: -20,
          pageLeft: -30,
          pageTop: -40,
        },
      );
    });
  });

  describe('onresize', () => {
    test('should be null by default', () => {
      expect(new VisualViewportMock().onresize).toBe(null);
    });

    test('should store assigned handler and call it on resize', () => {
      const viewport = new VisualViewportMock();
      const handler = mock.fn();
      viewport.onresize = handler;

      expect(viewport.onresize).toBe(handler);

      viewport.simulateResize({ width: 800 });

      expect(handler.mock.callCount()).toBe(1);
      expect(handler.mock.calls[0]?.arguments[0]?.type).toBe('resize');
      expect(viewport.width).toBe(800);
    });

    test('should not call previous handler after replacement', () => {
      const viewport = new VisualViewportMock();
      const first = mock.fn();
      const second = mock.fn();
      viewport.onresize = first;
      viewport.onresize = second;

      expect(viewport.onresize).toBe(second);

      viewport.simulateResize();

      expect(first.mock.callCount()).toBe(0);
      expect(second.mock.callCount()).toBe(1);
    });

    test('should not call handler after assignment of null', () => {
      const viewport = new VisualViewportMock();
      const handler = mock.fn();
      viewport.onresize = handler;
      viewport.onresize = null;

      expect(viewport.onresize).toBe(null);

      viewport.simulateResize();

      expect(handler.mock.callCount()).toBe(0);
    });
  });

  describe('onscroll', () => {
    test('should be null by default', () => {
      expect(new VisualViewportMock().onscroll).toBe(null);
    });

    test('should store assigned handler and call it on scroll', () => {
      const viewport = new VisualViewportMock();
      const handler = mock.fn();
      viewport.onscroll = handler;

      expect(viewport.onscroll).toBe(handler);

      viewport.simulateScroll({ pageLeft: 100 });

      expect(handler.mock.callCount()).toBe(1);
      expect(handler.mock.calls[0]?.arguments[0]?.type).toBe('scroll');
      expect(viewport.pageLeft).toBe(100);
    });

    test('should not call previous handler after replacement', () => {
      const viewport = new VisualViewportMock();
      const first = mock.fn();
      const second = mock.fn();
      viewport.onscroll = first;
      viewport.onscroll = second;

      expect(viewport.onscroll).toBe(second);

      viewport.simulateScroll();

      expect(first.mock.callCount()).toBe(0);
      expect(second.mock.callCount()).toBe(1);
    });

    test('should not call handler after assignment of null', () => {
      const viewport = new VisualViewportMock();
      const handler = mock.fn();
      viewport.onscroll = handler;
      viewport.onscroll = null;

      expect(viewport.onscroll).toBe(null);

      viewport.simulateScroll();

      expect(handler.mock.callCount()).toBe(0);
    });
  });

  describe('onscrollend', () => {
    test('should be null by default', () => {
      expect(new VisualViewportMock().onscrollend).toBe(null);
    });

    test('should store assigned handler and call it on scroll end', () => {
      const viewport = new VisualViewportMock();
      const handler = mock.fn();
      viewport.onscrollend = handler;

      expect(viewport.onscrollend).toBe(handler);

      viewport.simulateScroll({ pageTop: 200 });

      expect(handler.mock.callCount()).toBe(1);
      expect(handler.mock.calls[0]?.arguments[0]?.type).toBe('scrollend');
      expect(viewport.pageTop).toBe(200);
    });

    test('should not call previous handler after replacement', () => {
      const viewport = new VisualViewportMock();
      const first = mock.fn();
      const second = mock.fn();
      viewport.onscrollend = first;
      viewport.onscrollend = second;

      expect(viewport.onscrollend).toBe(second);

      viewport.simulateScroll();

      expect(first.mock.callCount()).toBe(0);
      expect(second.mock.callCount()).toBe(1);
    });

    test('should not call handler after assignment of null', () => {
      const viewport = new VisualViewportMock();
      const handler = mock.fn();
      viewport.onscrollend = handler;
      viewport.onscrollend = null;

      expect(viewport.onscrollend).toBe(null);

      viewport.simulateScroll();

      expect(handler.mock.callCount()).toBe(0);
    });
  });

  test('should call all three handlers for respective events', () => {
    const viewport = new VisualViewportMock();
    const onresize = mock.fn();
    const onscroll = mock.fn();
    const onscrollend = mock.fn();
    viewport.onresize = onresize;
    viewport.onscroll = onscroll;
    viewport.onscrollend = onscrollend;

    viewport.simulateResize({ width: 100, height: 100 });
    expect(onresize.mock.callCount()).toBe(1);
    expect(onscroll.mock.callCount()).toBe(0);
    expect(onscrollend.mock.callCount()).toBe(0);

    viewport.simulateScroll({ pageLeft: 1, pageTop: 2 });
    expect(onresize.mock.callCount()).toBe(1);
    expect(onscroll.mock.callCount()).toBe(1);
    expect(onscrollend.mock.callCount()).toBe(1);
  });
});
