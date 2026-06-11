import React, { useState, useEffect, useRef } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonFooter, IonInput, IonButton, IonIcon, IonAvatar,
  IonButtons, IonBackButton 
} from '@ionic/react';
import { sendOutline, arrowBack } from 'ionicons/icons';
import { Client } from '@stomp/stompjs';
import { useParams } from 'react-router-dom'; // IMPORTANTE: Para leer la URL

interface Mensaje {
  id: string;
  texto: string;
  usuarioId: string;
  hora: string;
}

const ChatRoomPage: React.FC = () => {
  // Leemos el ID de la sala desde la URL (ej: /chat/sala_pedrito)
  const { salaId } = useParams<{ salaId: string }>();
  
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const stompClient = useRef<Client | null>(null);
  
  const miUsuarioId = "dante_123";

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8085/ws-chat',
      onConnect: () => {
        console.log(`Conectado a la sala: ${salaId}`);
        // Usamos el salaId dinámico
        client.subscribe(`/topic/sala/${salaId}`, (mensajeRecibido) => {
          const mensajeNuevo: Mensaje = JSON.parse(mensajeRecibido.body);
          setMensajes((prev) => [...prev, mensajeNuevo]);
        });
      }
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) stompClient.current.deactivate();
    };
  }, [salaId]);

  const enviarMensaje = () => {
    if (nuevoMensaje.trim() === '' || !stompClient.current?.connected) return;
    
    const msj: Mensaje = {
      id: Date.now().toString(),
      texto: nuevoMensaje,
      usuarioId: miUsuarioId,
      hora: '' 
    };
    
    // Disparamos el mensaje a la sala dinámica
    stompClient.current.publish({
      destination: `/app/chat/${salaId}`,
      body: JSON.stringify(msj)
    });
    
    setNuevoMensaje('');
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonButtons slot="start">
            {/* El botón de atrás nos devuelve a la bandeja de entrada (/chat) */}
            <IonBackButton defaultHref="/chat" icon={arrowBack} text="Atrás" />
          </IonButtons>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 5px' }}>
            <IonAvatar style={{ width: '35px', height: '35px', marginRight: '10px' }}>
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" alt="Contacto" />
            </IonAvatar>
            <IonTitle style={{ padding: 0, fontWeight: 'bold' }}>Contacto</IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" className="ion-padding">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '20px' }}>
          {mensajes.map((msj) => {
            const esMio = msj.usuarioId === miUsuarioId;
            return (
              <div 
                key={msj.id} 
                style={{
                  alignSelf: esMio ? 'flex-end' : 'flex-start',
                  backgroundColor: esMio ? 'var(--ion-color-primary)' : '#ffffff',
                  color: esMio ? '#ffffff' : '#1f2937',
                  padding: '10px 15px',
                  borderRadius: '16px',
                  borderBottomRightRadius: esMio ? '4px' : '16px',
                  borderBottomLeftRadius: !esMio ? '4px' : '16px',
                  maxWidth: '80%',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                <p style={{ margin: 0, fontSize: '0.95rem' }}>{msj.texto}</p>
              </div>
            );
          })}
        </div>
      </IonContent>

      <IonFooter className="ion-no-border">
        <IonToolbar color="light" style={{ borderTop: '1px solid #e5e7eb', padding: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px' }}>
            <IonInput 
              value={nuevoMensaje}
              onIonInput={e => setNuevoMensaje(e.detail.value as string)}
              placeholder="Escribe..."
              style={{ backgroundColor: '#ffffff', borderRadius: '20px', paddingLeft: '15px', border: '1px solid #d1d5db' }}
              onKeyPress={e => { if(e.key === 'Enter') enviarMensaje(); }}
            />
            <IonButton 
              shape="round" 
              onClick={enviarMensaje}
              disabled={nuevoMensaje.trim() === '' || !stompClient.current?.connected}
              style={{ margin: 0, height: '40px', width: '40px' }}
            >
              <IonIcon slot="icon-only" icon={sendOutline} />
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default ChatRoomPage;