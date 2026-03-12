import { describe, mock, test } from 'node:test';
import { useContext, useEffect } from 'react';
import { expect } from '@std/expect';
import { render } from '@testing-library/react';
import { VisualViewportContext } from '../visual-viewport-context.ts';

describe('VisualViewportContext', () => {
  test('should use global visualViewport by default', () => {
    const TestComponent = ({
      handleViewport,
    }: {
      handleViewport: (viewport: VisualViewport | null) => void;
    }) => {
      const { getVisualViewport } = useContext(VisualViewportContext);

      useEffect(() => {
        handleViewport(getVisualViewport());
      }, [handleViewport, getVisualViewport]);

      return <div>Hello</div>;
    };

    const spy = mock.fn();
    expect(spy.mock.callCount()).toBe(0);

    render(<TestComponent handleViewport={spy} />);
    expect(spy.mock.callCount()).toBe(1);
    expect(spy.mock.calls[0]?.arguments[0] === window.visualViewport).toBe(true);
  });
});
