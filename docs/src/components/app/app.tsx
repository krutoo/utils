import { filterValidStories } from '@krutoo/showcase/runtime';
import { PathnameRouting, ShowcaseApp } from '@krutoo/showcase/runtime-showcase';
import type { Router } from '@krutoo/utils/router';
import { MDXProvider } from '@mdx-js/react';
import { CodeBlock } from '#components/code-block/code-block.tsx';
import { Link } from '#components/link/link.tsx';
import foundStories from '#found-stories';
import { withPublicPath } from '../../utils.ts';
import '@krutoo/showcase/runtime-showcase/styles.css';

const { validStories } = filterValidStories(foundStories);

const components = {
  pre: CodeBlock,
  a: Link,
};

export function App({ router }: { router?: Router }) {
  return (
    <MDXProvider components={components}>
      <ShowcaseApp
        stories={validStories}
        storySearch
        title='@krutoo/utils'
        logoSrc={{
          light: withPublicPath('./public/logo.svg'),
          dark: withPublicPath('./public/logo.dark.svg'),
        }}
        defaultStory={{
          pathname: '/main',
        }}
        colorSchemes={{
          enabled: true,
          attributeTarget: 'documentElement',
        }}
        headerLinks={[
          {
            name: 'GitHub',
            href: 'https://github.com/krutoo/utils',
          },
          {
            name: 'NPM',
            href: 'https://www.npmjs.com/package/@krutoo/utils',
          },
        ]}
        router={router}
        routing={new PathnameRouting({ publicPath: import.meta.env.PUBLIC_PATH })}
      />
    </MDXProvider>
  );
}
