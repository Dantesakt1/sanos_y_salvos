import React, { useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonAvatar, IonLabel, IonNote, IonBadge 
} from '@ionic/react';

interface ChatResumen {
  salaId: string;
  nombreContacto: string;
  ultimoMensaje: string;
  hora: string;
  mensajesSinLeer: number;
  fotoUrl: string;
}

const ChatListPage: React.FC = () => {
  // Simulamos tu base de datos de chats activos (empieza vacío o con historial)
  const [chatsActivos] = useState<ChatResumen[]>([
    {
      salaId: 'sala_pedrito',
      nombreContacto: 'Rescatista de Pedrito',
      ultimoMensaje: 'Lo tengo en mi casa, está a salvo.',
      hora: '10:02',
      mensajesSinLeer: 1,
      fotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
    }
  ]);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonTitle style={{ fontWeight: 'bold' }}>Mensajes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">
        {chatsActivos.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#6b7280', padding: '20px' }}>
            <h2>No tienes mensajes aún</h2>
            <p>Cuando contactes a alguien sobre un reporte, el chat aparecerá aquí.</p>
          </div>
        ) : (
          <IonList inset={true} style={{ borderRadius: '16px', margin: '16px' }}>
            {chatsActivos.map(chat => (
              // routerLink es la magia que nos lleva a la sala de chat específica
              <IonItem key={chat.salaId} routerLink={`/chat/${chat.salaId}`} detail={false} lines="inset">
                <IonAvatar slot="start">
                  <img src={chat.fotoUrl} alt={chat.nombreContacto} />
                </IonAvatar>
                <IonLabel>
                  <h2 style={{ fontWeight: chat.mensajesSinLeer > 0 ? 'bold' : 'normal', color: '#1f2937' }}>
                    {chat.nombreContacto}
                  </h2>
                  <p style={{ color: chat.mensajesSinLeer > 0 ? '#111827' : '#6b7280' }}>
                    {chat.ultimoMensaje}
                  </p>
                </IonLabel>
                <div slot="end" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.8rem' }}>
                  <IonNote color={chat.mensajesSinLeer > 0 ? 'primary' : 'medium'} style={{ marginBottom: '4px' }}>
                    {chat.hora}
                  </IonNote>
                  {chat.mensajesSinLeer > 0 && (
                    <IonBadge color="primary" style={{ borderRadius: '50%', padding: '4px 6px' }}>
                      {chat.mensajesSinLeer}
                    </IonBadge>
                  )}
                </div>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ChatListPage;