import { useState } from 'react';
import { useTransitionStatus } from '@krutoo/utils/react';
import { DemoBanner } from '#components/demo-banner/demo-banner.tsx';
import classNames from 'classnames';
import styles from './use-transition-status-demo.m.css';

export function UseTransitionStatusDemo() {
  const [open, setOpen] = useState(true);

  return (
    <DemoBanner className={styles.demo}>
      <button className={styles.button} onClick={() => setOpen(a => !a)}>
        {open ? 'Hide' : 'Show'}
      </button>
      <MyWidget open={open} />
    </DemoBanner>
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
