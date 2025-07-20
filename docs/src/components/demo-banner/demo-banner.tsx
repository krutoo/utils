import { type Ref, type HTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './demo-banner.m.css';

export interface DemoBannerProps extends HTMLAttributes<HTMLDivElement> {
  rootRef?: Ref<HTMLDivElement>;
}

export function DemoBanner({ rootRef, className, children, ...restProps }: DemoBannerProps) {
  return (
    <div ref={rootRef} className={classNames(styles.banner, className)} {...restProps}>
      {children}
    </div>
  );
}
