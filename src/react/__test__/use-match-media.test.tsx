import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { act, render } from '@testing-library/react';
import { MediaQueryListStub } from '../test-utils/media-query-list-stub.ts';
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

    let mql: MediaQueryListStub | null = null;

    const context: MatchMediaContextValue = {
      matchMedia(query) {
        mql = new MediaQueryListStub(query).toggle(true);
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
      mql?.toggle(false);
    });
    expect(renderCount).toBe(3);
    expect(container.textContent).toBe('Mobile');

    act(() => {
      mql?.toggle(true);
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

    let mql: MediaQueryListStub | null = null;

    const context: MatchMediaContextValue = {
      matchMedia(query) {
        mql = new MediaQueryListStub(query).toggle(true);
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
      mql?.toggle(false);
    });
    expect(renderCount).toBe(1);
    expect(container.textContent).toBe('Mobile');

    act(() => {
      mql?.toggle(true);
    });
    expect(renderCount).toBe(1);
    expect(container.textContent).toBe('Desktop');
  });
});
