import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { fireEvent, render } from '@testing-library/react';
import { useMutation } from '../use-mutation.ts';
import { useState } from 'react';
import { wait } from '../../../mod.ts';

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
});
