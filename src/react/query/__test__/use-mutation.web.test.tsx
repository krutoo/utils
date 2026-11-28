import { describe, test } from 'node:test';
import { useState } from 'react';
import { expect } from '@std/expect';
import { act, fireEvent, render } from '@testing-library/react';
import { wait } from '../../../misc/wait.ts';
import { useMutation } from '../use-mutation.ts';

async function logIn(payload: { login: string; password: string }) {
  await wait(200);

  if (payload.login === 'admin' && payload.password === '12345') {
    return { ok: true };
  }

  throw new Error('Wrong login or password');
}

function TestComponent() {
  const [key, setKey] = useState(1);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    key: String(key),
    mutation: logIn,
  });

  const disabled = mutation.status === 'pending';

  const onLoginChange = (e: { target: { value: string } }) => {
    setLogin(e.target.value);
  };

  const onPassChange = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };

  const onSubmit = () => {
    mutation.mutate({ login, password }).catch(() => {});
  };

  const onReset = () => {
    setKey(a => a + 1);
    setLogin('');
    setPassword('');
  };

  if (mutation.status === 'success') {
    return (
      <div data-marker='success'>
        <h2>Success!</h2>

        <button data-marker='reset' onClick={onReset}>
          Reset
        </button>
      </div>
    );
  }

  return (
    <div data-marker='form'>
      <h2>Log in</h2>

      {mutation.status === 'failure' && <div data-marker='error'>{String(mutation.error)}</div>}

      <input disabled={disabled} data-marker='login' onChange={onLoginChange} />
      <input disabled={disabled} data-marker='password' type='password' onChange={onPassChange} />

      <button disabled={disabled} data-marker='submit' onClick={onSubmit}>
        Submit
      </button>
    </div>
  );
}

describe('useMutation', () => {
  test('should use works correctly without context', async () => {
    const { getByTestId, queryAllByTestId } = render(<TestComponent />);

    // initial state
    expect(queryAllByTestId('form')).toHaveLength(1);
    expect(getByTestId('login').hasAttribute('disabled')).toBe(false);
    expect(getByTestId('password').hasAttribute('disabled')).toBe(false);
    expect(getByTestId('submit').hasAttribute('disabled')).toBe(false);

    // input right data and submit
    fireEvent.input(getByTestId('login'), { target: { value: 'admin' } });
    fireEvent.input(getByTestId('password'), { target: { value: '12345' } });
    fireEvent.click(getByTestId('submit'));

    // pending state
    expect(getByTestId('login').hasAttribute('disabled')).toBe(true);
    expect(getByTestId('password').hasAttribute('disabled')).toBe(true);
    expect(getByTestId('submit').hasAttribute('disabled')).toBe(true);

    // success
    await wait(300);
    expect(queryAllByTestId('form')).toHaveLength(0);
    expect(queryAllByTestId('success')).toHaveLength(1);
  });

  test('should pass abort signal to mutation and ignore stale result', async () => {
    const first = Promise.withResolvers<string>();
    const second = Promise.withResolvers<string>();
    const signals: AbortSignal[] = [];
    const aborted: boolean[] = [];

    function Component() {
      const mutation = useMutation<number, string>({
        mutation(payload, { signal }) {
          signals.push(signal);
          signal.addEventListener('abort', () => aborted.push(signal.aborted));

          return payload === 1 ? first.promise : second.promise;
        },
      });

      return (
        <>
          <button data-marker='first' onClick={() => void mutation.mutate(1)} />
          <button data-marker='second' onClick={() => void mutation.mutate(2)} />
          <div data-marker='state'>
            {mutation.status}:{mutation.data}
          </div>
        </>
      );
    }

    const { getByTestId } = render(<Component />);

    fireEvent.click(getByTestId('first'));

    expect(signals).toHaveLength(1);
    expect(signals[0]!.aborted).toBe(false);

    fireEvent.click(getByTestId('second'));

    expect(signals).toHaveLength(2);
    expect(signals[0]!.aborted).toBe(true);
    expect(signals[1]!.aborted).toBe(false);
    expect(aborted).toEqual([true]);

    await act(async () => {
      second.resolve('second');
      await second.promise;
    });

    expect(getByTestId('state').textContent).toBe('success:second');

    await act(async () => {
      first.resolve('first');
      await first.promise;
    });

    expect(getByTestId('state').textContent).toBe('success:second');
  });
});
