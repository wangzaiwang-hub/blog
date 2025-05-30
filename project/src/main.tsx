import { Buffer } from 'buffer/';
(window as any).Buffer = Buffer;

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ensureArticlesLoaded } from './lib/articles';
import './index.css';

ensureArticlesLoaded().catch(error => {
  console.error('[main.tsx] Error during initial article load:', error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
