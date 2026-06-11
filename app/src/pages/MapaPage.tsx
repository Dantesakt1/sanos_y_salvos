import React, { useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent 
} from '@ionic/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Mascota } from '../components/PetCard'; // Reutilizamos nuestra interfaz

// Parche obligatorio para que los íconos de Leaflet se vean bien en React
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: iconMarker,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapaPage: React.FC = () => {
  // Centro por defecto: Santiago de Chile (La Cisterna / Lo Espejo aprox)
  const [center] = useState<[number, number]>([-33.52, -70.66]);

  // Datos simulados (con lat y lng agregados)
  const [mascotasMapa] = useState<(Mascota & { lat: number; lng: number })[]>([
    {
      mascotaId: 1,
      nombre: 'fernando flop',
      especie: 'Gato',
      estado: 'perdida',
      distanciaKm: 10.3,
      fotoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200',
      lat: -33.521, 
      lng: -70.662
    },
    {
      mascotaId: 2,
      nombre: 'gatito',
      especie: 'Gato',
      estado: 'encontrada',
      distanciaKm: 10.3,
      fotoUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=200',
      lat: -33.522, 
      lng: -70.660
    }
  ]);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonTitle style={{ fontWeight: 'bold' }}>Mapa de Reportes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* El contenedor del mapa DEBE tener una altura definida en Ionic */}
        <div style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}>
          <MapContainer 
            center={center} 
            zoom={15} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false} // Quitamos los botones de zoom para que se sienta nativo (usarán los dedos)
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {mascotasMapa.map((pet) => (
              <Marker key={pet.mascotaId} position={[pet.lat, pet.lng]}>
                <Popup className="custom-mobile-popup">
                  <div style={{ textAlign: 'center', width: '140px' }}>
                    <img 
                      src={pet.fotoUrl} 
                      alt={pet.nombre} 
                      style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} 
                    />
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 'bold' }}>{pet.nombre}</h3>
                    <span style={{ 
                      backgroundColor: pet.estado === 'perdida' ? '#fee2e2' : '#d1fae5', 
                      color: pet.estado === 'perdida' ? '#ef4444' : '#059669',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}>
                      {pet.estado.toUpperCase()}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MapaPage;