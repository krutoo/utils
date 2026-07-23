import { createRoot } from 'react-dom/client';
import { App } from '#components/app/app.tsx';
import './reset.css';
import '@krutoo/showcase/runtime-showcase/styles.css';

createRoot(document.getElementById('root')!).render(<App />);
