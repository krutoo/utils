import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { fireEvent, render } from '@testing-library/react';
import { useEffect } from 'react';
import { useStableCallback } from '../use-stable-callback.ts';

interface TestComponentProps {
  callback: () => void;
  trigger: 'click' | 'render';
}

function TestComponent({ callback, trigger }: TestComponentProps) {
  const stableCallback = useStableCallback(callback);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('callbackChange'));
  }, [callback]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('stableCallbackChange'));
  }, [stableCallback]);

  const handleClick = () => {
    if (trigger === 'click') {
      stableCallback();
    }
  };

  if (trigger === 'render') {
    stableCallback();
  }

  return (
    <div data-marker='clickable' onClick={handleClick}>
      Hello, world!
    </div>
  );
}

describe('useStableCallback', () => {
  test('Should return stable wrapper of given callback', () => {
    const log: Array<string> = [];
    let callbackChangeCount = 0;
    let stableCallbackChangeCount = 0;

    window.addEventListener('callbackChange', () => {
      callbackChangeCount++;
    });
    window.addEventListener('stableCallbackChange', () => {
      stableCallbackChangeCount++;
    });

    // initial state
    expect(log).toEqual([]);
    expect(callbackChangeCount).toBe(0);
    expect(stableCallbackChangeCount).toBe(0);

    // first render - callback v1
    const { rerender, getByTestId } = render(
      <>
        <TestComponent trigger='click' callback={() => log.push('ver1')} />
      </>,
    );
    fireEvent.click(getByTestId('clickable'));
    expect(log).toEqual(['ver1']);
    expect(callbackChangeCount).toBe(1);
    expect(stableCallbackChangeCount).toBe(1);

    // second render - callback v2
    rerender(
      <>
        <TestComponent trigger='click' callback={() => log.push('ver2')} />
      </>,
    );
    fireEvent.click(getByTestId('clickable'));
    expect(log).toEqual(['ver1', 'ver2']);
    expect(callbackChangeCount).toBe(2);
    expect(stableCallbackChangeCount).toBe(1);
  });

  test('Stable callback should be actualized immediately during render', () => {
    const log: Array<string> = [];

    // initial state
    expect(log).toEqual([]);

    // first render - callback v1
    const { rerender } = render(
      <>
        <TestComponent trigger='render' callback={() => log.push('ver1')} />
      </>,
    );
    expect(log).toEqual(['ver1']);

    // second render - callback v2
    rerender(
      <>
        <TestComponent trigger='render' callback={() => log.push('ver2')} />
      </>,
    );
    expect(log).toEqual(['ver1', 'ver2']);

    // third render - callback v3
    rerender(
      <>
        <TestComponent trigger='render' callback={() => log.push('ver3')} />
      </>,
    );
    expect(log).toEqual(['ver1', 'ver2', 'ver3']);
  });
});
