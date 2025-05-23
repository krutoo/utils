/**
 * This script will install git hooks.
 * @see https://typicode.github.io/husky/how-to.html#ci-server-and-docker
 */

if (process.env.NODE_ENV === 'production' || process.env.CI === 'true') {
  process.exit(0);
}

const { default: husky } = await import('husky');

// eslint-disable-next-line no-console
console.log(husky());
