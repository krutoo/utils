/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-console */
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { filterValidStories } from '@krutoo/showcase/runtime';
import { ShowcaseApp } from '@krutoo/showcase/runtime-showcase';
import { MDXProvider } from '@mdx-js/react';
import { codeToHtml } from 'shiki';
import foundStories from '#found-stories';
import './reset.css';
import '@krutoo/showcase/runtime-showcase/styles.css';

const { validStories } = filterValidStories(foundStories);

// <code /> can be inside <pre /> or not, will check it by context
const CodeBlockContext = createContext(false);

function Pre({ children }: { children?: ReactNode }) {
  return (
    <CodeBlockContext.Provider value={true}>
      <pre>{children}</pre>
    </CodeBlockContext.Provider>
  );
}

function Code({ children, className }: { children?: ReactNode; className?: string }) {
  const isCodeBlock = useContext(CodeBlockContext);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (typeof className !== 'string') {
      return;
    }

    const lang = /^language-(.+)$/g.exec(className)?.[1];

    if (!lang) {
      return;
    }

    codeToHtml(String(children), { lang, theme: 'github-light', structure: 'inline' })
      .then(setContent)
      .catch(console.error);
  }, [children, className]);

  if (isCodeBlock && content) {
    return <code dangerouslySetInnerHTML={{ __html: content }}></code>;
  }

  return <code className={className}>{children}</code>;
}

const components = {
  pre: Pre,
  code: Code,
};

createRoot(document.getElementById('root')!).render(
  <MDXProvider components={components}>
    <ShowcaseApp
      stories={validStories}
      title='@krutoo/utils'
      logoSrc='public/logo.svg'
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
