import { createRoot } from 'react-dom/client';
import { filterValidStories } from '@krutoo/showcase/runtime';
import { ShowcaseApp } from '@krutoo/showcase/runtime-showcase';
import { MDXProvider } from '@mdx-js/react';
import foundStories from '#found-stories';
import { CodeBlock } from './components/code-block/code-block.tsx';
import { Link } from './components/link/link.tsx';
import './reset.css';
import '@krutoo/showcase/runtime-showcase/styles.css';

const { validStories } = filterValidStories(foundStories);

const components = {
  pre: CodeBlock,
  a: Link,
};

createRoot(document.getElementById('root')!).render(
  <MDXProvider components={components}>
    <ShowcaseApp
      stories={validStories}
      storySearch
      title='@krutoo/utils'
      logoSrc={{
        light: './public/logo.svg',
        dark: './public/logo.dark.svg',
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
    />
  </MDXProvider>,
);
