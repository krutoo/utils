import fs from 'node:fs/promises';
import path from 'node:path';
import { renderToString } from 'react-dom/server';
import { filterValidStories } from '@krutoo/showcase/runtime';
import { BrowserRouter } from '@krutoo/utils/router';
import { App } from '#components/app/app.tsx';
import { Helmet } from '#components/helmet/helmet.tsx';
import foundStories from '#found-stories';
import { withPublicPath } from './utils.ts';
import './reset.css';

const { validStories } = filterValidStories(foundStories);

for (const item of validStories) {
  await emitTemplate(item);

  if (item.pathname === '/main') {
    await emitTemplate(item, `./_default.html`);
  }
}

async function emitTemplate(
  story: (typeof validStories)[number],
  filename = `.${story.pathname}.html`,
) {
  const outputPath = path.join(import.meta.env.TEMPLATES_DIR, filename);

  const router = new BrowserRouter({
    defaultLocation: {
      pathname: withPublicPath(`.${story.pathname}`),
      search: '',
      hash: '',
    },
  });

  const markup = `<!doctype html>${renderToString(
    <Helmet>
      <div id='root'>
        <App router={router} />
      </div>
    </Helmet>,
  )}`;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, markup);
}
