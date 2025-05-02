import { createRoot } from 'react-dom/client';
import { filterValidStories } from '@krutoo/showcase/runtime';
import { ShowcaseApp } from '@krutoo/showcase/runtime-showcase';
import foundStories from '#found-stories';
import './reset.css';
import '@krutoo/showcase/runtime-showcase/styles.css';

const { validStories } = filterValidStories(foundStories);

createRoot(document.getElementById('root')!).render(
  <ShowcaseApp stories={validStories} title='@krutoo/utils' />,
);
