import React, { useState } from 'react';
import { 
  IonCard, IonCardContent, IonBadge, IonIcon, IonText, 
  IonButton, useIonRouter, IonAlert 
} from '@ionic/react';
import { locationOutline, searchOutline, heartOutline } from 'ionicons/icons';

export interface Mascota {
  mascotaId: number;
  nombre: string;
  especie: string;
  estado: string;
  distanciaKm: number;
  fotoUrl: string;
  raza?: string;
}

interface PetCardProps {
  pet: Mascota;
}

export const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const router = useIonRouter();
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  const cardStyle = {
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    margin: '16px',
    backgroundColor: '#ffffff'
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px'
  };

  // Función que simula el envío de la notificación y redirige al chat
  const confirmarContacto = () => {
    console.log(`Enviando notificación al dueño del reporte de ${pet.nombre}...`);
    // Aquí a futuro harás el POST a tu BFF para crear la sala de chat y lanzar la push notification
    router.push('/chat', 'forward', 'push');
  };

  return (
    <>
      <IonCard style={cardStyle}>
        <div style={{ position: 'relative' }}>
          <img 
            src={pet.fotoUrl || 'https://images.unsplash.com/photo-1543466835-00a732f3804c?w=400'} 
            alt={pet.nombre} 
            style={imgStyle}
          />
          <IonBadge 
            className={`estado-${pet.estado.toLowerCase()}`}
            style={{ position: 'absolute', top: '10px', left: '10px', padding: '6px 12px', borderRadius: '12px' }}
          >
            {pet.estado.toUpperCase()}
          </IonBadge>
        </div>

        <IonCardContent>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 5px 0' }}>
            {pet.nombre}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '10px' }}>
            {pet.especie} {pet.raza ? `• ${pet.raza}` : ''}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--ion-color-primary)', fontWeight: '600', marginBottom: '15px' }}>
            <IonIcon icon={locationOutline} style={{ marginRight: '4px' }} />
            <IonText>A {pet.distanciaKm.toFixed(1)} km de ti</IonText>
          </div>

          {/* RENDERIZADO CONDICIONAL DE BOTONES */}
          {pet.estado === 'perdida' ? (
            <IonButton 
              expand="block" 
              color="primary" 
              onClick={() => setMostrarAlerta(true)}
              style={{ fontWeight: 'bold', height: '45px' }}
            >
              <IonIcon slot="start" icon={searchOutline} />
              ¡Lo encontré!
            </IonButton>
          ) : (
            <IonButton 
              expand="block" 
              color="success" 
              onClick={() => setMostrarAlerta(true)}
              style={{ fontWeight: 'bold', height: '45px' }}
            >
              <IonIcon slot="start" icon={heartOutline} />
              ¡Es mío!
            </IonButton>
          )}
        </IonCardContent>
      </IonCard>

      {/* ALERTA DE CONFIRMACIÓN */}
      <IonAlert
        isOpen={mostrarAlerta}
        onDidDismiss={() => setMostrarAlerta(false)}
        header="¿Iniciar contacto?"
        message={`Se enviará una notificación al usuario que publicó a ${pet.nombre} para que puedan coordinar por chat.`}
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'Sí, contactar',
            handler: () => confirmarContacto()
          }
        ]}
      />
    </>
  );
};