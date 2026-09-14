import { ReactNode, useContext } from 'react';
import { RoutingContext, useMenuItems } from '@krutoo/showcase/runtime-showcase';
import { Callout } from '#components/callout/callout.tsx';
import { Link } from '#components/link/link.tsx';
import { withPublicPath } from '../../utils.ts';
import styles from './cards.m.css';

const MAIN_SECTIONS = [
  {
    href: withPublicPath('./react/overview'),
    title: 'React',
    description: 'SSR ready performant components and hooks',
  },
  {
    href: withPublicPath('./rspack/overview'),
    title: 'Rspack',
    description: 'Plugins to define configs easy',
  },
  {
    href: withPublicPath('./typescript/overview'),
    title: 'Typings',
    description: 'TypeScript type declarations',
  },
  {
    href: withPublicPath('./di/overview'),
    title: 'DI',
    description: 'Dependency injection toolkit',
  },
  {
    href: withPublicPath('./router/browser-router'),
    title: 'Router',
    description: 'Router implementation and React bindings',
  },
  {
    href: withPublicPath('./math/overview'),
    title: 'Math',
    description: 'Math and geometry functions',
  },
  {
    href: withPublicPath('./misc/overview'),
    title: 'Misc',
    description: 'Non specific helpers',
  },
  {
    href: withPublicPath('./dom/overview'),
    title: 'DOM',
    description: 'Browser utilities',
  },
];

export function CardLayout({ children }: { children?: ReactNode }): ReactNode {
  return <div className={styles.root}>{children}</div>;
}

export function MainSectionCards(): ReactNode {
  return (
    <CardLayout>
      {MAIN_SECTIONS.map((item, index) => (
        <Link key={index} className={styles.item} href={item.href}>
          <Callout>
            <Callout.Heading>{item.title}</Callout.Heading>
            <Callout.Main>{item.description}</Callout.Main>
          </Callout>
        </Link>
      ))}
    </CardLayout>
  );
}

export function StoryCards({ category }: { category?: string }): ReactNode {
  const routing = useContext(RoutingContext);
  const menuItems = useMenuItems({ grouping: false });

  const items = menuItems
    .map(item =>
      item.type === 'story' &&
      !item.story.meta?.menuHidden &&
      item.story.meta?.title &&
      (category ? item.story.meta.category === category : true)
        ? item
        : null,
    )
    .filter(item => item !== null);

  return (
    <CardLayout>
      {items.map((item, index) => (
        <Link key={index} className={styles.item} href={routing.getStoryShowcaseUrl(item.story)}>
          <Callout>
            <Callout.Main>{item.title}</Callout.Main>
          </Callout>
        </Link>
      ))}
    </CardLayout>
  );
}
