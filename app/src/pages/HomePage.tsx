import React, { useState } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonRefresher, 
  IonRefresherContent,
  RefresherEventDetail // <- IMPORTACIÓN CLAVE PARA TYPESCRIPT
} from '@ionic/react';

// Importamos el componente y el molde que creamos en PetCard
import { PetCard, Mascota } from '../components/PetCard';

const HomePage: React.FC = () => {
  // Le decimos a useState que va a guardar un Array de "Mascotas"
    const [reportes, setReportes] = useState<Mascota[]>([
        {
        mascotaId: 1,
        nombre: 'Maxi',
        especie: 'Perro',
        estado: 'perdida', // ¡Este mostrará "Lo encontré!"
        distanciaKm: 2.5,
        fotoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'
        },
        {
        mascotaId: 2,
        nombre: 'Gatito Callejero',
        especie: 'Gato',
        estado: 'encontrada', // ¡Este mostrará "Es mío!"
        distanciaKm: 0.8,
        fotoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'
        }
    ]);

  // AQUÍ ESTÁ LA MAGIA: Le decimos a TS exactamente qué es este evento
  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      // Aquí iría tu llamado a: bffApi.getMascotasCercanas()
      event.detail.complete(); // Ahora TS sabe que 'complete()' sí existe
    }, 1500);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonTitle style={{ fontWeight: 'bold' }}>Sanos y Salvos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen color="light">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div style={{ padding: '20px 16px 5px 16px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0', color: '#111827' }}>
            Reportes Recientes
          </h1>
          <p style={{ color: '#6b7280', margin: '5px 0 10px 0' }}>
            Ayúdalos a volver a casa
          </p>
        </div>

        {reportes.map((pet) => (
          <PetCard key={pet.mascotaId} pet={pet} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;