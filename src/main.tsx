import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BEFORE_ASSET_RELOAD } from './lib/assetRecovery';

// A deployment can replace hashed assets while an older tab is still open.
// Vite emits this event when a lazy route's JS or CSS can no longer be loaded.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const key = 'crivo:preload-recovery';
  const lastReload = Number(sessionStorage.getItem(key) || 0);
  if (Date.now() - lastReload < 30_000) return;
  sessionStorage.setItem(key, String(Date.now()));
  window.dispatchEvent(new Event(BEFORE_ASSET_RELOAD));
  window.location.reload();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
