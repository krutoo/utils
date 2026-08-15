/* eslint-disable no-console */
import { ReactNode, isValidElement, useMemo, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '@krutoo/utils/react';
import { getProcessedLang, useHighlighter } from './utils.ts';
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
  const highlighter = useHighlighter();
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
    if (!(
      isValidElement<CodeProps>(children) &&
      children.type === 'code' &&
      typeof children.props.children === 'string'
    )) {
      return null;
    }

    const lang = /^language-(.+)$/g.exec(children.props.className ?? '')?.[1] ?? 'plaintext';

    return {
      code: children.props.children,
      lang: getProcessedLang(lang),
    };
  }, [children]);

  useIsomorphicLayoutEffect(() => {
    if (!highlighter || !sourceCode) {
      return;
    }

    try {
      const html = highlighter.codeToHtml(sourceCode.code, {
        lang: sourceCode.lang,
        theme: 'poimandres',
      });

      setContent(html);
    } catch (error) {
      console.error(error);
    }
  }, [highlighter, sourceCode]);

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
