/* eslint-disable jsdoc/require-jsdoc */
import { AnchorHTMLAttributes, useEffect, useState } from 'react';

export function Link({ href, target, ...restProps }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const [internal, setInternal] = useState(false);

  useEffect(() => {
    if (!href) {
      return;
    }

    setInternal(new URL(new Request(href).url).hostname === new URL(location.href).hostname);
  }, [href]);

  const resultTarget = target ?? (!internal ? '_blank' : undefined);

  return <a href={href} target={resultTarget} {...restProps} />;
}
