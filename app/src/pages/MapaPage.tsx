import React, { useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonModal, IonFab, IonFabButton, IonIcon, IonBadge, IonButton, IonAlert 
} from '@ionic/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  closeOutline, pawOutline, locationOutline, personOutline, 
  informationCircleOutline, searchOutline, heartOutline, openOutline,
  callOutline, mailOutline, chatbubblesOutline
} from 'ionicons/icons';

import { Mascota } from '../components/PetCard'; 

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
}

interface MascotaConContacto extends Mascota {
  contacto: Usuario;
}

const MapaPage: React.FC = () => {
  const [center] = useState<[number, number]>([-33.45, -70.66]);

  const [mascotasMapa] = useState<MascotaConContacto[]>([
    {
      id: 1,
      nombre: 'Maxi',
      especie: 'Perro',
      raza: 'Poodle',
      estado: 'perdida',
      latitud: -33.456, 
      longitud: -70.662,
      descripcion: 'Se asustó con unos ruidos y salió corriendo. Tiene un collar azul con su nombre grabado.',
      usuarioId: 'maria_22',
      fotoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200',
      distanciaKm: 1.2,
      contacto: {
        id: 'maria_22',
        nombre: 'María Paz',
        apellido: 'Pérez',
        email: 'mparez.contacto@email.com',
        telefono: '+56912345678',
        direccion: 'Av. El Parrón 1230',
        ciudad: 'Santiago'
      }
    },
    {
      id: 2,
      nombre: 'Gatito rescatado',
      especie: 'Gato',
      raza: 'Mestizo',
      estado: 'encontrada',
      latitud: -33.448, 
      longitud: -70.675,
      descripcion: 'Estaba atrapado en el motor de un auto llorando. Lo tengo resguardado temporalmente en mi patio.',
      usuarioId: 'dante_123',
      fotoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200',
      distanciaKm: 0.8,
      contacto: {
        id: 'dante_123',
        nombre: 'Dante Valentín',
        apellido: 'Castillo',
        email: 'dante.castillo@email.com',
        telefono: '+56987654321',
        direccion: 'San Miguel Centro',
        ciudad: 'Santiago'
      }
    }
  ]);

  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<MascotaConContacto | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  const crearIconoMascota = (pet: Mascota) => {
    const colorBorder = pet.estado === 'perdida' ? '#ef4444' : '#10b981';
    return L.divIcon({
      className: 'custom-leaflet-icon',
      html: `
        <div class="map-avatar-container" style="border-color: ${colorBorder};">
          <img src="${pet.fotoUrl}" class="map-avatar-img" />
        </div>
      `,
      iconSize: [46, 46],
      iconAnchor: [23, 23],
      popupAnchor: [0, -25]
    });
  };

  const abrirDetalleCompleto = (pet: MascotaConContacto) => {
    setMascotaSeleccionada(pet);
    setMostrarModal(true);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="light" className="map-header-toolbar">
          <IonTitle className="map-header-title">Mapa en vivo</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="map-container-wrapper">
          <MapContainer center={center} zoom={14} className="map-leaflet-container" zoomControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            
            {mascotasMapa.map((pet) => (
              <Marker key={pet.id} position={[pet.latitud, pet.longitud]} icon={crearIconoMascota(pet)}>
                <Popup>
                  <div className="custom-popup-container">
                    <h3 className="custom-popup-title">{pet.nombre}</h3>
                    
                    <div className="custom-popup-distance">
                      <IonIcon icon={locationOutline} className="popup-distance-icon" />
                      <span>A {pet.distanciaKm.toFixed(1)} km</span>
                    </div>

                    <IonButton 
                      expand="block" 
                      size="small" 
                      shape="round" 
                      color={pet.estado === 'perdida' ? 'primary' : 'success'} 
                      onClick={() => abrirDetalleCompleto(pet)} 
                      className="popup-action-btn"
                    >
                      <IonIcon slot="end" icon={openOutline} />
                      Ver Detalles
                    </IonButton>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <IonModal isOpen={mostrarModal} onDidDismiss={() => setMostrarModal(false)}>
          {mascotaSeleccionada && (
            <IonContent color="light">
              <IonFab vertical="top" horizontal="end" slot="fixed" className="modal-close-fab">
                <IonFabButton color="light" size="small" onClick={() => setMostrarModal(false)}>
                  <IonIcon icon={closeOutline} />
                </IonFabButton>
              </IonFab>

              <div className="modal-pet-banner">
                <img src={mascotaSeleccionada.fotoUrl} alt={mascotaSeleccionada.nombre} />
                <div className="modal-pet-gradient"></div>
                <IonBadge className={mascotaSeleccionada.estado === 'perdida' ? 'pet-card-badge-perdida modal-badge-pos' : 'pet-card-badge-encontrada modal-badge-pos'}>
                  {mascotaSeleccionada.estado.toUpperCase()}
                </IonBadge>
              </div>

              <div className="modal-pet-body">
                <div className="modal-pet-header">
                  <h1>{mascotaSeleccionada.nombre}</h1>
                  <div className="modal-pet-taxonomia">
                    <IonIcon icon={pawOutline} />
                    <span>{mascotaSeleccionada.especie} {mascotaSeleccionada.raza ? `• ${mascotaSeleccionada.raza}` : ''}</span>
                  </div>
                </div>

                <div className="modal-pet-stats-grid">
                  <div className="modal-stat-card">
                    <IonIcon icon={locationOutline} color="primary" />
                    <span className="stat-label">Ubicación</span>
                    <strong className="stat-value">A {mascotaSeleccionada.distanciaKm.toFixed(1)} km</strong>
                  </div>
                  <div className="modal-stat-card">
                    <IonIcon icon={personOutline} color="secondary" />
                    <span className="stat-label">Localidad</span>
                    <strong className="stat-value">{mascotaSeleccionada.contacto.ciudad}</strong>
                  </div>
                </div>

                <h3 className="modal-section-title">
                  <IonIcon icon={informationCircleOutline} color="primary" />
                  Descripción
                </h3>
                <p className="modal-pet-description-text">
                  {mascotaSeleccionada.descripcion || 'Sin descripción adicional.'}
                </p>

                <h3 className="modal-section-title contact-section-title">
                  <IonIcon icon={personOutline} color="primary" />
                  Información de Contacto
                </h3>
                
                <div className="modal-user-contact-card">
                  <div className="contact-user-info">
                    <h4>{mascotaSeleccionada.contacto.nombre} {mascotaSeleccionada.contacto.apellido}</h4>
                    <p>{mascotaSeleccionada.contacto.direccion}, {mascotaSeleccionada.contacto.ciudad}</p>
                  </div>

                  <div className="contact-actions-row">
                    <a href={`tel:${mascotaSeleccionada.contacto.telefono}`} className="contact-action-btn call">
                      <IonIcon icon={callOutline} />
                      <span>Llamar</span>
                    </a>
                    <a href={`mailto:${mascotaSeleccionada.contacto.email}?subject=Reporte de ${mascotaSeleccionada.nombre}`} className="contact-action-btn email">
                      <IonIcon icon={mailOutline} />
                      <span>Correo</span>
                    </a>
                    <div className="contact-action-btn chat" onClick={() => setMostrarAlerta(true)}>
                      <IonIcon icon={chatbubblesOutline} />
                      <span>Chat App</span>
                    </div>
                  </div>
                </div>

              </div>
            </IonContent>
          )}
        </IonModal>

        <IonAlert
          isOpen={mostrarAlerta}
          onDidDismiss={() => setMostrarAlerta(false)}
          header="¿Abrir chat interno?"
          message={`Te conectarás por mensajería en tiempo real con ${mascotaSeleccionada?.contacto.nombre}.`}
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Ir al chat', handler: () => { setMostrarModal(false); } }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default MapaPage;