import { createRoot } from 'react-dom/client';
import { filterValidStories } from '@krutoo/showcase/runtime';
import { ShowcaseApp } from '@krutoo/showcase/runtime-showcase';
import { MDXProvider } from '@mdx-js/react';
import foundStories from '#found-stories';
import './reset.css';
import '@krutoo/showcase/runtime-showcase/styles.css';
import { CodeBlock } from './components/code-block/code-block.tsx';

const { validStories } = filterValidStories(foundStories);

const components = {
  pre: CodeBlock,
};

createRoot(document.getElementById('root')!).render(
  <MDXProvider components={components}>
    <ShowcaseApp
      stories={validStories}
      title='@krutoo/utils'
      logoSrc='./public/logo.svg'
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
