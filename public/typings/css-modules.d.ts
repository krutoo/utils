declare module '*.module.css' {
  const styles: { [key: string]: string | undefined };

  export default styles;
}

declare module '*.m.css' {
  const styles: { [key: string]: string | undefined };

  export default styles;
}

// @todo import attributes
