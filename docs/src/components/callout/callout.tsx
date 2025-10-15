import { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './callout.m.css';

export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  level?: 'info' | 'danger';
}

export interface CalloutHeadingProps extends HTMLAttributes<HTMLHeadingElement> {}

export interface CalloutMainProps extends HTMLAttributes<HTMLDivElement> {}

export function Callout({ level = 'info', children, className, ...restProps }: CalloutProps) {
  return (
    <div {...restProps} className={classNames(styles.callout, styles[level], className)}>
      {children}
    </div>
  );
}

function CalloutHeading({ children, className, ...restProps }: CalloutHeadingProps) {
  return (
    <h3 {...restProps} className={classNames(styles.heading, className)}>
      {children}
    </h3>
  );
}

function CalloutMain({ children, className, ...restProps }: CalloutMainProps) {
  return (
    <div {...restProps} className={classNames(styles.main, className)}>
      {children}
    </div>
  );
}

Callout.Heading = CalloutHeading;
Callout.Main = CalloutMain;
