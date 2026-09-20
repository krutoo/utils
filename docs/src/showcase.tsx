import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from '@krutoo/utils/router';
import { App } from '#components/app/app.tsx';
import './reset.css';
import '@krutoo/showcase/runtime-showcase/styles.css';

const router = new BrowserRouter({
  defaultLocation: window.location,
});

router.connect();

hydrateRoot(document.getElementById('root')!, <App router={router} />);
