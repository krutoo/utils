import { Callout } from '#components/callout/callout.tsx';
import { Link } from '#components/link/link.tsx';
import { withPublicPath } from '../../utils.ts';
import styles from './cards.m.css';

export function Cards() {
  return (
    <div className={styles.root}>
      <Link className={styles.item} href={withPublicPath('./react/overview')}>
        <Callout>
          <Callout.Heading>React</Callout.Heading>
          <Callout.Main>SSR ready performant components and hooks</Callout.Main>
        </Callout>
      </Link>
      <Link className={styles.item} href={withPublicPath('./rspack/overview')}>
        <Callout>
          <Callout.Heading>Rspack</Callout.Heading>
          <Callout.Main>Plugins to define configs easy</Callout.Main>
        </Callout>
      </Link>
      <Link className={styles.item} href={withPublicPath('./typescript/overview')}>
        <Callout>
          <Callout.Heading>Typings</Callout.Heading>
          <Callout.Main>TypeScript type declarations</Callout.Main>
        </Callout>
      </Link>
      <Link className={styles.item} href={withPublicPath('./di/overview')}>
        <Callout>
          <Callout.Heading>DI</Callout.Heading>
          <Callout.Main>Dependency injection toolkit</Callout.Main>
        </Callout>
      </Link>
      <Link className={styles.item} href={withPublicPath('./router/browser-router')}>
        <Callout>
          <Callout.Heading>Router</Callout.Heading>
          <Callout.Main>Router implementation and React bindings</Callout.Main>
        </Callout>
      </Link>
      <Link className={styles.item} href={withPublicPath('./math/overview')}>
        <Callout>
          <Callout.Heading>Math</Callout.Heading>
          <Callout.Main>Math and geometry functions</Callout.Main>
        </Callout>
      </Link>
      <Link className={styles.item} href={withPublicPath('./misc/overview')}>
        <Callout>
          <Callout.Heading>Misc</Callout.Heading>
          <Callout.Main>Non specific helpers</Callout.Main>
        </Callout>
      </Link>
      <Link className={styles.item} href={withPublicPath('./dom/overview')}>
        <Callout>
          <Callout.Heading>DOM</Callout.Heading>
          <Callout.Main>Browser utilities</Callout.Main>
        </Callout>
      </Link>
    </div>
  );
}
