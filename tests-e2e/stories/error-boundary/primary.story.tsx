import { useState } from 'react';
import { ErrorBoundary } from '@krutoo/utils/react';
import styles from './primary.m.css';

export const meta = {
  category: 'React components/ErrorBoundary',
  title: 'Primary example',
};

function BrokenUI({ broken }: { broken?: boolean }) {
  if (broken) {
    throw Error('Render error');
  }

  return <div className={styles.broken}>I am fine 👍</div>;
}

function Fallback() {
  return <div className={styles.fallback}>Oops, something broke =(</div>;
}

export default function Example() {
  const [broken, setBroken] = useState(false);

  return (
    <div className={styles.container}>
      <button disabled={broken} onClick={() => setBroken(true)}>
        Broke it!
      </button>

      <ErrorBoundary fallback={<Fallback />}>
        <BrokenUI broken={broken} />
      </ErrorBoundary>
    </div>
  );
}
