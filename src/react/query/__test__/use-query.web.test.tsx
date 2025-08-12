import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { useQuery } from '../use-query.ts';
import { act, render } from '@testing-library/react';

interface RequestEventMap {
  success: CustomEvent<{ data: any }>;
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

function request(url: string) {
  return new Promise<{ url: string; data: { message: string } }>((done, fail) => {
    events.addEventListener('success', event => done({ url, data: event.detail.data }));
    events.addEventListener('failure', event => fail(event.detail.error));
  });
}

function TestComponent() {
  const { data, status, error } = useQuery({
    async query() {
      return request('/fake-api/something').then(res => res.data);
    },
  });

  return (
    <>
      <div>Status: {status}</div>
      <div>Message: {data?.message ?? '[empty]'}</div>
      {!!error && <div>Error: {String(error)}</div>}
    </>
  );
}

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
});
