import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign browser ResizeObserver loop notification warnings
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (
      typeof e.message === 'string' &&
      (e.message.includes('ResizeObserver loop completed with undelivered notifications') ||
        e.message.includes('ResizeObserver loop limit exceeded'))
    ) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
