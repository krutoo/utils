import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { render } from '@testing-library/react';
import { Lifecycle } from '../lifecycle.tsx';

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
});
