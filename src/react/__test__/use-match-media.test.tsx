import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { act, render } from '@testing-library/react';
import { MediaQueryListMock } from '../../testing/mod.ts';
import { MatchMediaContext, type MatchMediaContextValue } from '../mod.ts';
import { useMatchMedia } from '../use-match-media.ts';
import { useRef } from 'react';

describe('useMatchMedia', () => {
  test('should sync state with media query list', () => {
    let renderCount = 0;

    function TestComponent() {
      const desktop = useMatchMedia('(min-width: 1024px)');

      renderCount++;

      return desktop ? <div>Desktop</div> : <div>Mobile</div>;
    }

    let mql: MediaQueryListMock | null = null;

    const context: MatchMediaContextValue = {
      matchMedia(query) {
        mql = new MediaQueryListMock(query);
        mql.simulateChange(true);

        return mql;
      },
    };

    expect(renderCount).toBe(0);

    const { container } = render(
      <MatchMediaContext value={context}>
        <TestComponent />
      </MatchMediaContext>,
    );
    expect(renderCount).toBe(2);
    expect(container.textContent).toBe('Desktop');

    act(() => {
      mql?.simulateChange(false);
    });
    expect(renderCount).toBe(3);
    expect(container.textContent).toBe('Mobile');

    act(() => {
      mql?.simulateChange(true);
    });
    expect(renderCount).toBe(4);
    expect(container.textContent).toBe('Desktop');
  });

  test('should work correctly in stateless mode', () => {
    let renderCount = 0;

    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null);

      useMatchMedia('(min-width: 1024px)', {
        mode: 'stateless',
        onChange({ matches }) {
          if (ref.current) {
            ref.current.textContent = matches ? 'Desktop' : 'Mobile';
          }
        },
      });

      renderCount++;

      return <div ref={ref}>Desktop</div>;
    }

    let mql: MediaQueryListMock | null = null;

    const context: MatchMediaContextValue = {
      matchMedia(query) {
        mql = new MediaQueryListMock(query);
        mql.simulateChange(true);
        return mql;
      },
    };

    expect(renderCount).toBe(0);

    const { container } = render(
      <MatchMediaContext value={context}>
        <TestComponent />
      </MatchMediaContext>,
    );
    expect(renderCount).toBe(1);
    expect(container.textContent).toBe('Desktop');

    act(() => {
      mql?.simulateChange(false);
    });
    expect(renderCount).toBe(1);
    expect(container.textContent).toBe('Mobile');

    act(() => {
      mql?.simulateChange(true);
    });
    expect(renderCount).toBe(1);
    expect(container.textContent).toBe('Desktop');
  });
});
