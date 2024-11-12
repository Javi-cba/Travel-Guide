import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css';
import { DrawerProvider } from './context/drawerLugares';
import { PreferencProvider } from './context/preferences';
import { RecomendProvider } from './context/recomend';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
  >
    <DrawerProvider>
      <PreferencProvider>
        <RecomendProvider>
          <App />
        </RecomendProvider>
      </PreferencProvider>
    </DrawerProvider>
  </Auth0Provider>
);
