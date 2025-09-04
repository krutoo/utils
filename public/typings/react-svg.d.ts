declare module '*.svg' {
  import type { ComponentType, SVGProps } from 'react';

  const SvgComponent: ComponentType<SVGProps<SVGSVGElement>>;

  export default SvgComponent;
}

// @todo import attributes
