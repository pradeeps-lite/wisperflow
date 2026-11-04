import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'leaflet/dist/leaflet.css';

// Global error handlers for Google Maps Platform authentication & billing events
(window as any).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-auth-failure'));
  window.dispatchEvent(new CustomEvent('gmp-billing-error'));
};

const origConsoleError = console.error;
console.error = (...args: unknown[]) => {
  origConsoleError.apply(console, args);
  const msg = args.map((a) => String(a)).join(' ');
  if (
    msg.includes('BillingNotEnabledMapError') ||
    msg.includes('billing-not-enabled-map-error') ||
    msg.includes('OverQuotaMapError') ||
    msg.includes('ApiNotActivatedMapError')
  ) {
    window.dispatchEvent(new CustomEvent('gmp-billing-error'));
  }
};

createRoot(document.getElementById('root')!).render(<App />);
