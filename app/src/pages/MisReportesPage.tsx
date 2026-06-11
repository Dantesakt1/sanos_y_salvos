import React, { useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonLabel, IonThumbnail, IonBadge, 
  IonItemSliding, IonItemOptions, IonItemOption, IonIcon
} from '@ionic/react';
import { trash } from 'ionicons/icons';
import { Mascota } from '../components/PetCard'; // Reutilizamos la interfaz

const MisReportesPage: React.FC = () => {
  // Simulamos los datos que llegarán del microservicio
  const [misReportes, setMisReportes] = useState<Mascota[]>([
    {
      mascotaId: 101,
      nombre: 'Gato travieso',
      especie: 'Gato',
      estado: 'encontrada',
      distanciaKm: 0,
      fotoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200'
    }
  ]);

  const eliminarReporte = (id: number) => {
    // Aquí a futuro: bffApi.eliminarReporte(id)
    setMisReportes(misReportes.filter(r => r.mascotaId !== id));
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonTitle style={{ fontWeight: 'bold' }}>Mis Reportes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">
        <div style={{ padding: '20px 16px 10px 16px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0', color: '#111827' }}>
            Tu Historial
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '5px 0 0 0' }}>
            Desliza un reporte hacia la izquierda para eliminarlo.
          </p>
        </div>

        <IonList inset={true} style={{ borderRadius: '16px', margin: '16px' }}>
          {misReportes.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
              No tienes reportes activos.
            </div>
          ) : (
            misReportes.map(reporte => (
              <IonItemSliding key={reporte.mascotaId}>
                <IonItem lines="full">
                  <IonThumbnail slot="start" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                    <img alt={reporte.nombre} src={reporte.fotoUrl} />
                  </IonThumbnail>
                  <IonLabel>
                    <h2 style={{ fontWeight: 'bold', color: '#1f2937' }}>{reporte.nombre}</h2>
                    <p>{reporte.especie}</p>
                  </IonLabel>
                  <IonBadge 
                    slot="end" 
                    color={reporte.estado === 'perdida' ? 'danger' : 'success'}
                  >
                    {reporte.estado.toUpperCase()}
                  </IonBadge>
                </IonItem>

                {/* Opciones ocultas que aparecen al deslizar */}
                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={() => eliminarReporte(reporte.mascotaId)}>
                    <IonIcon slot="icon-only" icon={trash} />
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MisReportesPage;