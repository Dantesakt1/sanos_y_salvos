import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/react';
import { homeOutline, addCircleOutline, mapOutline, listOutline, chatbubblesOutline } from 'ionicons/icons';


/* Importación de Páginas */
import HomePage from '../pages/HomePage';
import ReportarPage from '../pages/ReportarPage';
import MapaPage from '../pages/MapaPage';
import MisReportesPage from '../pages/MisReportesPage';
import ChatListPage from '../pages/ChatListPage';
import ChatRoomPage from '../pages/ChatRoomPage';

export const MainTabs: React.FC = () => {
  return (
    <IonTabs>
      
      {/* EL PROYECTOR DE PANTALLAS */}
      <IonRouterOutlet>
        <Route exact path="/home"><HomePage /></Route>
        <Route exact path="/reportar"><ReportarPage /></Route>
        <Route exact path="/mapa"><MapaPage /></Route>
        <Route exact path="/mis-reportes"><MisReportesPage /></Route>
        <Route exact path="/"><Redirect to="/home" /></Route>
        <Route exact path="/chat"><ChatListPage /></Route>
        <Route exact path="/chat/:salaId"><ChatRoomPage /></Route>
      </IonRouterOutlet>

      {/* EL MENÚ INFERIOR (Bottom Tab Bar) */}
      <IonTabBar 
        slot="bottom" 
        color="light" 
        style={{ 
          paddingBottom: '5px', 
          paddingTop: '5px',
          boxShadow: '0px -2px 10px rgba(0,0,0,0.05)',
          borderTop: 'none'
        }}
      >
        <IonTabButton tab="home" href="/home">
          <IonIcon aria-hidden="true" icon={homeOutline} />
          <IonLabel style={{ fontWeight: '500' }}>Inicio</IonLabel>
        </IonTabButton>

        <IonTabButton tab="reportar" href="/reportar">
          <IonIcon aria-hidden="true" icon={addCircleOutline} />
          <IonLabel style={{ fontWeight: '500' }}>Reportar</IonLabel>
        </IonTabButton>

        <IonTabButton tab="mapa" href="/mapa">
          <IonIcon aria-hidden="true" icon={mapOutline} />
          <IonLabel style={{ fontWeight: '500' }}>Mapa</IonLabel>
        </IonTabButton>

        <IonTabButton tab="mis-reportes" href="/mis-reportes">
          <IonIcon aria-hidden="true" icon={listOutline} />
          <IonLabel style={{ fontWeight: '500' }}>Mis Reportes</IonLabel>
        </IonTabButton>
        <IonTabButton tab="chat" href="/chat">
          <IonIcon aria-hidden="true" icon={chatbubblesOutline} />
          <IonLabel style={{ fontWeight: '500' }}>Chat</IonLabel>
        </IonTabButton>
      </IonTabBar>

    </IonTabs>
  );
};