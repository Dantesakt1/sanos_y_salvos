import React, { useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonRefresher, IonRefresherContent, RefresherEventDetail,
  IonSearchbar, IonSegment, IonSegmentButton, IonLabel,
  IonButtons, IonButton, IonIcon
} from '@ionic/react';
import { notificationsOutline } from 'ionicons/icons';

import { PetCard, Mascota } from '../components/PetCard';

const HomePage: React.FC = () => {
  const [filtro, setFiltro] = useState('todos');
  const [textoBusqueda, setTextoBusqueda] = useState('');

  // DATOS ACTUALIZADOS: Ahora coinciden 100% con Mascota.java
  const [reportes, setReportes] = useState<Mascota[]>([
    {
      id: 1,
      nombre: 'Maxi',
      especie: 'Perro',
      raza: 'Mestizo',
      estado: 'perdida',
      latitud: -33.456,
      longitud: -70.662,
      descripcion: 'Llevaba un collar azul con una chapita de hueso. Es muy asustadizo pero no muerde. Se perdió cerca del parque central.',
      usuarioId: 'dante_123',
      fotoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
      distanciaKm: 2.5
    },
    {
      id: 2,
      nombre: 'Gatito Callejero',
      especie: 'Gato',
      raza: 'Siamés',
      estado: 'encontrada',
      latitud: -33.448,
      longitud: -70.675,
      descripcion: 'Lo encontré maullando debajo de un auto. Estaba mojado y tiene una pequeña mancha blanca en la pata derecha. Lo tengo resguardado en mi casa.',
      usuarioId: 'maria_rescatista',
      fotoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
      distanciaKm: 0.8
    }
  ]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      event.detail.complete(); 
    }, 1500);
  };

  const reportesFiltrados = reportes.filter(pet => {
    const coincideFiltro = filtro === 'todos' || pet.estado === filtro;
    const coincideBusqueda = pet.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) || 
                             pet.especie.toLowerCase().includes(textoBusqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="light" style={{ paddingTop: '10px', paddingBottom: '5px' }}>
          <IonTitle>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 'normal' }}>Hola, bienvenido a</span>
              <span style={{ fontWeight: '900', fontSize: '1.3rem', color: 'var(--ion-color-primary)', letterSpacing: '-0.5px' }}>
                Sanos y Salvos
              </span>
            </div>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton shape="round" style={{ backgroundColor: '#ffffff', borderRadius: '50%', width: '40px', height: '40px', marginRight: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <IonIcon icon={notificationsOutline} color="dark" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen color="light">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div style={{ padding: '10px 16px' }}>
          
          <IonSearchbar 
            placeholder="Buscar por nombre o especie..." 
            value={textoBusqueda}
            onIonInput={(e) => setTextoBusqueda(e.detail.value!)}
            style={{ 
              padding: '0', 
              '--border-radius': '12px', 
              '--box-shadow': 'none', 
              '--background': '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              marginBottom: '15px'
            }} 
          />

          <IonSegment 
            value={filtro} 
            onIonChange={(e) => setFiltro(e.detail.value as string)}
            style={{ backgroundColor: '#f3f4f6', borderRadius: '10px', padding: '4px', marginBottom: '15px' }}
          >
            <IonSegmentButton value="todos" style={{ borderRadius: '8px' }}>
              <IonLabel style={{ fontWeight: '600', textTransform: 'capitalize' }}>Todos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="perdida" style={{ borderRadius: '8px' }}>
              <IonLabel style={{ fontWeight: '600', textTransform: 'capitalize' }}>Perdidos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="encontrada" style={{ borderRadius: '8px' }}>
              <IonLabel style={{ fontWeight: '600', textTransform: 'capitalize' }}>Encontrados</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {reportesFiltrados.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '40px', color: '#6b7280' }}>
              <p>No se encontraron mascotas con esos filtros.</p>
            </div>
          )}
        </div>

        <div style={{ paddingBottom: '20px', paddingLeft: '16px', paddingRight: '16px' }}>
          {reportesFiltrados.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>

      </IonContent>
    </IonPage>
  );
};

export default HomePage;