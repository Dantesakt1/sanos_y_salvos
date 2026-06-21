import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-dantesakt1.us.auth0.com"
      clientId="k7USitHCy48qVAzV0kbPjXNXoy0tSNbe"
      authorizationParams={{
        redirect_uri: window.location.origin,
        // El audience debe ser el identificador de tu API en Auth0 
        // (el mismo que usaste para configurar Spring Boot)
        audience: "https://api-sanosysalvos-auth0/" 
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);