declare module '*.module.css' {
  const classes: { [key: string]: string | undefined };
  export default classes;
}

declare module '*.m.css' {
  const classes: { [key: string]: string | undefined };
  export default classes;
}
