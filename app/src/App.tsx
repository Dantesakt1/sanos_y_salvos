import React from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './theme/app-style.css';
import './theme/variables.css';

/* Importamos nuestro nuevo Layout */
import { MainTabs } from './components/MainTabs';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <MainTabs />
    </IonReactRouter>
  </IonApp>
);

export default App;