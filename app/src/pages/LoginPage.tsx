import React from 'react';
import { 
  IonPage, IonContent, IonButton, IonIcon 
} from '@ionic/react';
import { logInOutline, pawOutline } from 'ionicons/icons';
import { useAuth0 } from '@auth0/auth0-react';

const LoginPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <IonPage>
      <IonContent color="light">
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          
          <div style={{ backgroundColor: 'var(--ion-color-primary)', padding: '25px', borderRadius: '50%', marginBottom: '20px', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)' }}>
            <IonIcon icon={pawOutline} style={{ fontSize: '5rem', color: '#ffffff' }} />
          </div>
          
          <h1 style={{ fontWeight: '900', fontSize: '2.5rem', color: '#111827', margin: '0 0 10px 0', letterSpacing: '-1px' }}>
            Sanos y Salvos
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', textAlign: 'center', marginBottom: '50px', maxWidth: '300px' }}>
            La red colaborativa para reunir a las mascotas con sus familias.
          </p>

          <IonButton 
            shape="round" 
            size="large" 
            onClick={() => loginWithRedirect()}
            style={{ width: '100%', maxWidth: '350px', height: '60px', fontWeight: 'bold', fontSize: '1.2rem', '--box-shadow': '0 8px 20px rgba(16, 185, 129, 0.3)' }}
          >
            <IonIcon slot="start" icon={logInOutline} />
            Ingresar o Registrarse
          </IonButton>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;