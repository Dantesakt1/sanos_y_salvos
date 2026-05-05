import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {Auth0Provider} from "@auth0/auth0-react"
//limpia la url despues de la llamada
const onRedirectCallback = (appState)=>{
  window.history.replaceState(
    {},document.title,appState?.returnTo || window.location.pathname
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain='dev-dantesakt1.us.auth0.com'
      clientId='k7USitHCy48qVAzV0kbPjXNXoy0tSNbe'
      onRedirectCallback={onRedirectCallback}
      authorizationParams={{
        redirect_uri:window.location.origin,
        audience:"https://api-sanosysalvos-auth0/"
      }}
      cacheLocation='localstorage'
      useRefreshTokens={true}>
      <App />
    </Auth0Provider>
  </StrictMode>,
)
