import { AnchorHTMLAttributes, MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from '@krutoo/utils/react';

export function Link({
  href,
  target,
  onClick,
  ...restProps
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const navigate = useNavigate();
  const [internal, setInternal] = useState(false);

  useEffect(() => {
    if (!href) {
      return;
    }

    setInternal(new URL(new Request(href).url).hostname === new URL(window.location.href).hostname);
  }, [href]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || event.currentTarget.target === '_blank') {
      return;
    }

    event.preventDefault();
    navigate(event.currentTarget.href);
  };

  const resultTarget = target ?? (!internal ? '_blank' : undefined);

  return <a href={href} target={resultTarget} {...restProps} onClick={handleClick} />;
}
