import React, { useState, useEffect } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonIcon 
} from '@ionic/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth0 } from "@auth0/auth0-react";
import { locationOutline, callOutline, personOutline } from 'ionicons/icons';

// Reparación de iconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Componente para mover la cámara suavemente
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

const MapaPage: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [posicionMapa, setPosicionMapa] = useState<[number, number]>([-33.4489, -70.6693]);
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  const API_BFF_URL = 'http://localhost:8085/api/bff/mascotas-cercanas';

  useEffect(() => {
    const cargarMascotas = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(API_BFF_URL, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Error en el BFF');
        
        const data = await response.json();
        setMascotas(data);
        
        if (data.length > 0 && data[0].latitud && data[0].longitud) {
          setPosicionMapa([data[0].latitud, data[0].longitud]);
        }
      } catch (error) {
        console.error("Error cargando mapa:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarMascotas();
  }, [getAccessTokenSilently]);

  // Función para manejar fotos rotas
  const handleImgError = (e: any, especie: string) => {
    e.target.onerror = null;
    e.target.src = especie === 'Gato' 
      ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200' 
      : 'https://images.unsplash.com/photo-1543466835-00a732f3804c?w=200';
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="light">
          <IonTitle style={{ fontWeight: '900', color: 'var(--ion-color-primary)' }}>Mapa de Reportes</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Usamos flexbox para dividir la pantalla 55% mapa, 45% lista */}
      <IonContent fullscreen scrollY={false}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* ÁREA DEL MAPA (55% de la pantalla) */}
          <div style={{ flex: '0 0 55%', position: 'relative' }}>
            <MapContainer center={posicionMapa} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <ChangeView center={posicionMapa} />
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              
              {mascotas.map(m => {
                if (!m.latitud || !m.longitud) return null;
                return (
                  <Marker key={m.mascotaId} position={[m.latitud, m.longitud]}>
                    <Popup>
                      <div style={{ textAlign: 'center', minWidth: '150px' }}>
                        <img 
                          src={m.fotoUrl} 
                          onError={(e) => handleImgError(e, m.especie)}
                          alt="pet" 
                          style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <h3 style={{ margin: '10px 0 5px 0', fontWeight: 'bold' }}>{m.nombreMascota}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#666', fontSize: '12px', marginBottom: '5px' }}>
                          <IonIcon icon={callOutline} /> {m.contactoTelefono}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#666', fontSize: '12px' }}>
                          <IonIcon icon={personOutline} /> {m.contactoNombre}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>

          {/* ÁREA DE LA LISTA LATERAL/INFERIOR (45% de la pantalla con scroll) */}
          <div style={{ flex: '1', backgroundColor: '#f8fafc', overflowY: 'auto', padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <IonIcon icon={locationOutline} color="primary" /> Reportes Cercanos
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{mascotas.length} encontrados</span>
            </div>

            {cargando ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <IonSpinner name="crescent" color="primary" />
              </div>
            ) : mascotas.length > 0 ? (
              mascotas.map(m => (
                <div 
                  key={m.mascotaId} 
                  onClick={() => setPosicionMapa([m.latitud, m.longitud])}
                  style={{ 
                    display: 'flex', 
                    padding: '10px', 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    marginBottom: '10px',
                    boxShadow: posicionMapa[0] === m.latitud ? '0 0 0 2px var(--ion-color-primary)' : '0 2px 5px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                >
                  <img 
                    src={m.fotoUrl} 
                    onError={(e) => handleImgError(e, m.especie)}
                    alt="thumb"
                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', marginRight: '15px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '1rem', color: '#1f2937' }}>{m.nombreMascota}</strong>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 'bold', 
                        padding: '3px 8px', 
                        borderRadius: '10px',
                        backgroundColor: m.estado === 'perdida' ? '#fee2e2' : '#dcfce7',
                        color: m.estado === 'perdida' ? '#ef4444' : '#10b981'
                      }}>
                        {m.estado.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
                      {m.especie} • a {m.distanciaKm?.toFixed(1) || 0} km
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '20px' }}>No hay reportes en esta zona.</p>
            )}
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default MapaPage;