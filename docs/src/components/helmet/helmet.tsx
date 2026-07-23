import type { ReactNode } from 'react';

export interface HelmetProps {
  children?: ReactNode;
}

export function Helmet({ children }: HelmetProps) {
  return (
    <html>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Documentation | @krutoo/showcase</title>
        <meta name='description' content='Simple library for creating documentation websites' />
      </head>
      <body>{children}</body>
    </html>
  );
}
