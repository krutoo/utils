import { afterEach, describe, mock, test } from 'node:test';
import { expect } from '@std/expect';
import { act, render } from '@testing-library/react';
import { MemoryQueryManager } from '../memory-query-manager.ts';
import { QueryMangerContext } from '../query-manager-context.tsx';
import { useQuery } from '../use-query.ts';

interface RequestEventMap {
  success: CustomEvent<{ data: { message: string } }>;
  failure: CustomEvent<{ error: unknown }>;
}

interface AssetsEvents extends EventTarget {
  addEventListener<K extends keyof RequestEventMap>(
    type: K,
    listener: (event: RequestEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
  removeEventListener<K extends keyof RequestEventMap>(
    type: K,
    listener: (event: RequestEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
}

const events: AssetsEvents = new EventTarget();

const request = mock.fn((url: string) => {
  return new Promise<{ url: string; data: { message: string } }>((done, fail) => {
    events.addEventListener('success', event => done({ url, data: event.detail.data }));
    events.addEventListener('failure', event => fail(event.detail.error));
  });
});

function TestComponent() {
  const { data, status, error } = useQuery({
    async query() {
      return request('/fake-api/something').then(res => res.data);
    },
    key: 'fake',
  });

  return (
    <>
      <div>Status: {status}</div>
      <div>Message: {data?.message ?? '[empty]'}</div>
      {!!error && <div>Error: {String(error)}</div>}
    </>
  );
}

function TestApp({ page }: { page: 'home' | 'settings' }) {
  return (
    <>
      <header data-marker='header'>
        <TestComponent />
      </header>

      {page === 'home' && (
        <main data-marker='home'>
          <TestComponent />
        </main>
      )}

      {page === 'settings' && (
        <main data-marker='settings'>
          <TestComponent />
        </main>
      )}
    </>
  );
}

afterEach(() => {
  request.mock.resetCalls();
});

describe('useQuery', () => {
  test('should return actual query state', async () => {
    const { container } = render(<TestComponent />);

    expect(container.textContent).toContain('Status: pending');
    expect(container.textContent).toContain('Message: [empty]');

    await act(async () => {
      const fakeData = { message: 'Hello from query!' };
      events.dispatchEvent(new CustomEvent('success', { detail: { data: fakeData } }));
    });

    expect(container.textContent).toContain('Status: success');
    expect(container.textContent).toContain('Message: Hello from query!');
  });

  test('should handle promise reject', async () => {
    const { container } = render(<TestComponent />);

    expect(container.textContent).toContain('Status: pending');
    expect(container.textContent).toContain('Message: [empty]');

    await act(async () => {
      const fakeError = new Error('FakeError');
      events.dispatchEvent(new CustomEvent('failure', { detail: { error: fakeError } }));
    });

    expect(container.textContent).toContain('Status: failure');
    expect(container.textContent).toContain('Message: [empty]');
    expect(container.textContent).toContain('Error: FakeError');
  });

  describe('with MemoryQueryManager', () => {
    test('should create one query for key and share between hooks', async () => {
      const manager = new MemoryQueryManager();

      expect(request.mock.callCount()).toBe(0);

      const { getByTestId } = render(
        <QueryMangerContext value={manager}>
          <TestApp page='home' />
        </QueryMangerContext>,
      );

      expect(getByTestId('header').textContent).toContain('Status: pending');
      expect(getByTestId('header').textContent).toContain('Message: [empty]');

      expect(getByTestId('home').textContent).toContain('Status: pending');
      expect(getByTestId('home').textContent).toContain('Message: [empty]');

      expect(request.mock.callCount()).toBe(1);

      await act(async () => {
        const fakeData = { message: 'Hello from query!' };
        events.dispatchEvent(new CustomEvent('success', { detail: { data: fakeData } }));
      });

      expect(getByTestId('header').textContent).toContain('Status: success');
      expect(getByTestId('header').textContent).toContain('Message: Hello from query!');

      expect(getByTestId('home').textContent).toContain('Status: success');
      expect(getByTestId('home').textContent).toContain('Message: Hello from query!');

      expect(request.mock.callCount()).toBe(1);
    });
  });

  test('should ignore stale query result', async () => {
    const first = Promise.withResolvers<string>();
    const second = Promise.withResolvers<string>();
    const signals: AbortSignal[] = [];

    function Component({ id }: { id: number }) {
      const { data, status } = useQuery(
        {
          query({ signal }): Promise<string> {
            signals.push(signal);
            return id === 1 ? first.promise : second.promise;
          },
        },
        [id],
      );

      return (
        <>
          {status}:{data}
        </>
      );
    }

    const { container, rerender } = render(<Component id={1} />);

    rerender(<Component id={2} />);

    expect(signals.length).toBe(2);
    expect(signals[0]!.aborted).toBe(true);
    expect(signals[1]!.aborted).toBe(false);

    await act(async () => {
      second.resolve('second');
      await second.promise;
    });

    expect(container.textContent).toBe('success:second');

    await act(async () => {
      first.resolve('first');
      await first.promise;
    });

    expect(container.textContent).toBe('success:second');
  });
});
