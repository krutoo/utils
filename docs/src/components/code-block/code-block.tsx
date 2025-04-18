/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-console */
import { isValidElement, ReactNode, useEffect, useMemo, useState } from 'react';
import { codeToHtml } from 'shiki';
import styles from './code-block.m.css';

export interface CodeBlockProps {
  children?: ReactNode;
}

interface CodeProps {
  children?: ReactNode;
  className?: string;
}

export function CodeBlock({ children }: { children?: ReactNode }) {
  const [content, setContent] = useState('');

  const sourceCode = useMemo(() => {
    if (!isValidElement<CodeProps>(children)) {
      return null;
    }

    if (children.type !== 'code') {
      return null;
    }

    if (typeof children.props.children !== 'string') {
      return null;
    }

    let lang = /^language-(.+)$/g.exec(children.props.className ?? '')?.[1];

    if (!lang) {
      lang = 'plaintext';
    }

    return {
      code: children.props.children,
      lang,
    };
  }, [children]);

  useEffect(() => {
    if (!sourceCode) {
      return;
    }

    codeToHtml(sourceCode.code, { lang: sourceCode.lang, theme: 'poimandres' })
      .then(setContent)
      .catch(console.error);
  }, [sourceCode]);

  if (content) {
    return <div className={styles.codeblock} dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return (
    <div className={styles.codeblock}>
      <pre>{children}</pre>
    </div>
  );
}
