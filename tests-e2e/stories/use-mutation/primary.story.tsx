import { useState } from 'react';
import { wait } from '@krutoo/utils';
import { useMutation } from '@krutoo/utils/react';
import styles from './primary.story.m.css';

export const meta = {
  category: 'React hooks/useMutation',
  title: 'Primary example',
};

async function logIn(payload: { login: string; password: string }) {
  await wait(500);

  if (payload.login === 'admin' && payload.password === '12345') {
    return { ok: true };
  }

  throw Error('Wrong login or password');
}

export default function Example() {
  const [key, setKey] = useState(1);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    key: String(key),
    mutation: logIn,
  });

  const disabled = mutation.status === 'pending';

  const handleLoginChange = (e: { target: { value: string } }) => {
    setLogin(e.target.value);
  };

  const handlePasswordChange = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    mutation.mutate({ login, password }).catch(() => {});
  };

  const handleReset = () => {
    setKey(a => a + 1);
    setLogin('');
    setPassword('');
  };

  return (
    <div className={styles.form}>
      {mutation.status === 'success' && (
        <>
          <h3>Success!</h3>
          <button onClick={handleReset}>Reset</button>
        </>
      )}

      {mutation.status !== 'success' && (
        <>
          <h3>Log in</h3>

          {mutation.status === 'failure' && (
            <div className={styles.error}>{String(mutation.error)}</div>
          )}

          <input
            disabled={disabled}
            type='text'
            placeholder='Your login'
            onChange={handleLoginChange}
          />

          <input
            disabled={disabled}
            type='password'
            placeholder='Password'
            onChange={handlePasswordChange}
          />

          <button disabled={disabled} onClick={handleSubmit}>
            Submit
          </button>
        </>
      )}
    </div>
  );
}
