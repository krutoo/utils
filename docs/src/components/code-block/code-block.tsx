/* eslint-disable no-console */
import { isValidElement, ReactNode, useMemo, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '@krutoo/utils/react';
import { codeToHtml } from 'shiki';
import styles from './code-block.m.css';

export interface CodeBlockProps {
  title?: string;
  children?: ReactNode;
}

interface CodeProps {
  children?: ReactNode;
  className?: string;
}

export function CodeBlock({ title, children }: CodeBlockProps) {
  const [content, setContent] = useState('');
  const [background, setBackground] = useState<string | undefined>(undefined);
  const blockRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const code = blockRef.current?.children[0];

    if (!code) {
      return;
    }

    setBackground(getComputedStyle(code).backgroundColor);
  }, [content]);

  const sourceCode = useMemo(() => {
    if (
      !(
        isValidElement<CodeProps>(children) &&
        children.type === 'code' &&
        typeof children.props.children === 'string'
      )
    ) {
      return null;
    }

    let lang = /^language-(.+)$/g.exec(children.props.className ?? '')?.[1];

    if (!lang) {
      lang = 'plaintext';
    }

    // traffic economy - load one bundle of shiki syntax for multiple syntaxes
    if (['js', 'jsx', 'ts', 'javascript', 'typescript'].includes(lang.toLowerCase())) {
      lang = 'tsx';
    }

    return {
      code: children.props.children,
      lang,
    };
  }, [children]);

  useIsomorphicLayoutEffect(() => {
    if (!sourceCode) {
      return;
    }

    codeToHtml(sourceCode.code, { lang: sourceCode.lang, theme: 'poimandres' })
      .then(setContent)
      .catch(console.error);
  }, [sourceCode]);

  return (
    <div className={styles.root} style={{ background }}>
      {title && <div className={styles.header}>{title}</div>}
      {content ? (
        <div
          ref={blockRef}
          className={styles.codeblock}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div className={styles.codeblock}>
          <pre>{children}</pre>
        </div>
      )}
    </div>
  );
}
