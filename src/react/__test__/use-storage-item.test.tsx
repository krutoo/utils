import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { useStorageItem } from '../use-storage-item.ts';
import { renderToString } from 'react-dom/server';

describe('useStorageItem', () => {
  test('should works on server', () => {
    function TestComponent({ defaultValue }: { defaultValue?: string }) {
      const [state, setState] = useStorageItem('money', {
        storage: () => localStorage,
        defaultValue,
      });

      return (
        <>
          <div data-marker='display'>Value: {state ?? '[empty]'}</div>
          <button onClick={() => setState('bar')}>Set bar</button>
          <button onClick={() => setState('baz')}>Set baz</button>
          <button onClick={() => setState(null)}>Reset value</button>
        </>
      );
    }

    expect(() => renderToString(<TestComponent />)).not.toThrow();
    expect(() => renderToString(<TestComponent defaultValue='foo' />)).not.toThrow();
  });
});
