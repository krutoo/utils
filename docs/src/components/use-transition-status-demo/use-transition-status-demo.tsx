/* eslint-disable jsdoc/require-jsdoc */
import { useState } from 'react';
import { useTransitionStatus } from '@krutoo/utils/react';
import classNames from 'classnames';
import styles from './use-transition-status-demo.m.css';

export function UseTransitionStatusDemo() {
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.demo}>
      <button className={styles.button} onClick={() => setOpen(a => !a)}>
        {open ? 'Hide' : 'Show'}
      </button>
      <MyWidget open={open} />
    </div>
  );
}

function MyWidget({ open }: { open: boolean }) {
  const status = useTransitionStatus({
    open,
    duration: {
      opening: 500,
      closing: 200,
    },
  });

  if (status === 'closed') {
    return null;
  }

  const className = classNames(
    //
    styles.widget,
    styles[`widget-${status}`],
  );

  return <div className={className}>My Widget!</div>;
}
