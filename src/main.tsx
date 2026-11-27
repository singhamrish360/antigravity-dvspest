import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { initAdsClickConversionTracking } from './adsConversionTracking';
import './index.css';

initAdsClickConversionTracking();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
