import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'

// PWA — registra service worker e gerencia install prompt
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// PWA — detecta prompt de instalação
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  window.__sasyraDeferredPrompt = deferredPrompt;
});

window.__sasyraInstallPWA = async () => {
  const prompt = window.__sasyraDeferredPrompt;
  if (!prompt) return false;
  prompt.prompt();
  const result = await prompt.userChoice;
  window.__sasyraDeferredPrompt = null;
  return result.outcome === 'accepted';
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
