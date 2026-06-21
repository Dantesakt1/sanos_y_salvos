import React from 'react';
import { IonApp, setupIonicReact, IonSpinner } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useAuth0 } from '@auth0/auth0-react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './theme/app-style.css';
import './theme/variables.css';

/* Importamos nuestro nuevo Layout y la página de Login */
import { MainTabs } from './components/MainTabs';
import LoginPage from './pages/LoginPage'; 

setupIonicReact();

const App: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  // 1. Mientras Auth0 verifica en background si hay una sesión, mostramos un spinner
  if (isLoading) {
    return (
      <IonApp>
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <IonSpinner name="crescent" color="primary" style={{ transform: 'scale(1.5)' }} />
        </div>
      </IonApp>
    );
  }

  // 2. Si el usuario NO está autenticado, la única pantalla que existe es el Login
  if (!isAuthenticated) {
    return (
      <IonApp>
        <LoginPage />
      </IonApp>
    );
  }

  // 3. Si SI está autenticado, cargamos tu estructura normal con el MainTabs
  return (
    <IonApp>
      <IonReactRouter>
        <MainTabs />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;