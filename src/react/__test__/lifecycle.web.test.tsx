import { describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { render } from '@testing-library/react';
import { Lifecycle, type LifecycleProps } from '../lifecycle.tsx';

describe('Lifecycle', () => {
  test('should fire callback correctly', () => {
    const log: string[] = [];

    const { container, unmount } = render(
      <Lifecycle
        onMount={() => log.push('onMount')}
        onUnmount={() => log.push('onUnmount')}
        onMountSync={() => log.push('onMountSync')}
        onUnmountSync={() => log.push('onUnmountSync')}
      >
        Lifecycle component tests
      </Lifecycle>,
    );

    expect(container.textContent).toBe('Lifecycle component tests');
    expect(log).toEqual([
      //
      'onMountSync',
      'onMount',
    ]);

    unmount();
    expect(log).toEqual([
      //
      'onMountSync',
      'onMount',
      'onUnmountSync',
      'onUnmount',
    ]);
  });

  test('should call actual callbacks', () => {
    const initial = {
      onMount: mock.fn<() => void>(),
      onUnmount: mock.fn<() => void>(),
      onMountSync: mock.fn<() => void>(),
      onUnmountSync: mock.fn<() => void>(),
    } satisfies LifecycleProps;

    const latest = {
      onMount: mock.fn<() => void>(),
      onUnmount: mock.fn<() => void>(),
      onMountSync: mock.fn<() => void>(),
      onUnmountSync: mock.fn<() => void>(),
    } satisfies LifecycleProps;

    expect(initial.onMount.mock.callCount()).toBe(0);
    expect(initial.onMountSync.mock.callCount()).toBe(0);
    expect(initial.onUnmount.mock.callCount()).toBe(0);
    expect(initial.onUnmountSync.mock.callCount()).toBe(0);

    const { container, rerender, unmount } = render(
      <Lifecycle {...initial}>Lifecycle test</Lifecycle>,
    );

    expect(container.textContent).toBe('Lifecycle test');
    expect(initial.onMount.mock.callCount()).toBe(1);
    expect(initial.onMountSync.mock.callCount()).toBe(1);
    expect(initial.onUnmount.mock.callCount()).toBe(0);
    expect(initial.onUnmountSync.mock.callCount()).toBe(0);

    expect(latest.onMount.mock.callCount()).toBe(0);
    expect(latest.onMountSync.mock.callCount()).toBe(0);
    expect(latest.onUnmount.mock.callCount()).toBe(0);
    expect(latest.onUnmountSync.mock.callCount()).toBe(0);

    rerender(<Lifecycle {...latest}>Lifecycle test</Lifecycle>);
    expect(initial.onMount.mock.callCount()).toBe(1);
    expect(initial.onMountSync.mock.callCount()).toBe(1);
    expect(initial.onUnmount.mock.callCount()).toBe(0);
    expect(initial.onUnmountSync.mock.callCount()).toBe(0);

    expect(latest.onMount.mock.callCount()).toBe(0);
    expect(latest.onMountSync.mock.callCount()).toBe(0);
    expect(latest.onUnmount.mock.callCount()).toBe(0);
    expect(latest.onUnmountSync.mock.callCount()).toBe(0);

    unmount();
    expect(initial.onMount.mock.callCount()).toBe(1);
    expect(initial.onMountSync.mock.callCount()).toBe(1);
    expect(initial.onUnmount.mock.callCount()).toBe(0);
    expect(initial.onUnmountSync.mock.callCount()).toBe(0);

    expect(latest.onMount.mock.callCount()).toBe(0);
    expect(latest.onMountSync.mock.callCount()).toBe(0);
    expect(latest.onUnmount.mock.callCount()).toBe(1);
    expect(latest.onUnmountSync.mock.callCount()).toBe(1);
  });
});
