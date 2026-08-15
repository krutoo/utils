import { useEffect, useState } from 'react';
import { once } from '@krutoo/utils';
import { type HighlighterCore, createHighlighterCore, createJavaScriptRegexEngine } from 'shiki';
import themeOneDarkPro from 'shiki/themes/poimandres.mjs';

// IMPORTANT: make singleton by using `once` according to "shiki" docs
export const getHighlighterCore = once((): Promise<HighlighterCore> => {
  return createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    langs: [
      // supported langs:
      import('shiki/langs/sh.mjs'),
      import('shiki/langs/tsx.mjs'),
      import('shiki/langs/css.mjs'),
    ],
    themes: [
      // themes:
      themeOneDarkPro,
    ],
  });
});

export function useHighlighter(): HighlighterCore | null {
  const [highlighter, setHighlighter] = useState<HighlighterCore | null>(null);

  useEffect(() => {
    let mount = true;

    getHighlighterCore()
      .then(result => {
        if (!mount) {
          return;
        }

        setHighlighter(result);
      })
      // eslint-disable-next-line no-console
      .catch(console.error);

    return () => {
      mount = false;
    };
  }, []);

  return highlighter;
}

export function getProcessedLang(lang: string): string {
  // make lang from ext (remove first dot if exist)
  switch (lang.replace(/^\./, '')) {
    case 'sh':
    case 'bash':
    case 'shell':
    case 'shellscript':
      return 'sh';

    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return 'tsx';

    default:
      return lang;
  }
}
