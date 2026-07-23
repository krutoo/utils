export function withPublicPath(path: string): string {
  const base = import.meta.env.PUBLIC_PATH ?? '';
  const url = new URL(path, new URL(base, 'https://foobar.baz'));

  return `${url.pathname}${url.hash}${url.search}`;
}
