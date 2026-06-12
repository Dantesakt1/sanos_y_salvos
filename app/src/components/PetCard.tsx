import React, { useState } from 'react';
import { 
  IonCard, IonCardContent, IonBadge, IonIcon, IonText, 
  IonButton, useIonRouter, IonAlert, IonModal, IonContent, IonFab, IonFabButton 
} from '@ionic/react';
import { 
  locationOutline, searchOutline, heartOutline, pawOutline, personOutline, closeOutline, informationCircleOutline 
} from 'ionicons/icons';

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  estado: string;
  latitud: number;
  longitud: number;
  descripcion: string;
  usuarioId: string;
  fotoUrl: string;
  distanciaKm: number;
}

interface PetCardProps {
  pet: Mascota;
}

export const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const router = useIonRouter();
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const isPerdida = pet.estado.toLowerCase() === 'perdida';

  const confirmarContacto = () => {
    router.push(`/chat/sala_mascota_${pet.id}`, 'forward', 'push');
    setMostrarModal(false);
  };

  const handleAccionClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setMostrarAlerta(true);
  };

  return (
    <>
      {/* TARJETA PRINCIPAL (Usa las clases nativas de tu CSS) */}
      <IonCard className="pet-card-container" onClick={() => setMostrarModal(true)}>
        
        <div className="pet-card-image-box">
          <img src={pet.fotoUrl || 'https://images.unsplash.com/photo-1543466835-00a732f3804c?w=400'} alt={pet.nombre} className="pet-card-img" />
          <div className="pet-card-overlay"></div>

          <IonBadge className={isPerdida ? 'pet-card-badge-perdida' : 'pet-card-badge-encontrada'}>
            {pet.estado.toUpperCase()}
          </IonBadge>

          <div className="pet-card-text-block">
            <h2 className="pet-card-title">{pet.nombre}</h2>
            <div className="pet-card-subtitle">
              <IonIcon icon={pawOutline} />
              <span>{pet.especie} {pet.raza ? `• ${pet.raza}` : ''}</span>
            </div>
          </div>
        </div>

        <IonCardContent className="pet-card-content">
          {pet.descripcion && (
            <p className="pet-card-description-truncated">
              "{pet.descripcion}"
            </p>
          )}

          <div className="pet-card-footer-layout">
            <div className="pet-card-distance-pill">
              <IonIcon icon={locationOutline} color="primary" />
              <IonText>A {pet.distanciaKm.toFixed(1)} km</IonText>
            </div>

            <IonButton 
              expand="block" 
              shape="round" 
              color={isPerdida ? 'primary' : 'success'} 
              onClick={handleAccionClick}
              className="pet-card-btn"
            >
              <IonIcon slot="start" icon={isPerdida ? searchOutline : heartOutline} />
              {isPerdida ? '¡Lo encontré!' : '¡Es mío!'}
            </IonButton>
          </div>
        </IonCardContent>
      </IonCard>

      {/* ==========================================
          MODAL DE DETALLE EXTENDIDO
          ========================================== */}
      <IonModal isOpen={mostrarModal} onDidDismiss={() => setMostrarModal(false)}>
        <IonContent color="light">
          
          {/* Botón flotante cerrar */}
          <IonFab vertical="top" horizontal="end" slot="fixed" className="modal-close-fab">
            <IonFabButton color="light" size="small" onClick={() => setMostrarModal(false)}>
              <IonIcon icon={closeOutline} />
            </IonFabButton>
          </IonFab>

          {/* Banner de Imagen Superior */}
          <div className="modal-pet-banner">
            <img src={pet.fotoUrl} alt={pet.nombre} />
            <div className="modal-pet-gradient"></div>
            <IonBadge className={isPerdida ? 'pet-card-badge-perdida modal-badge-pos' : 'pet-card-badge-encontrada modal-badge-pos'}>
              {pet.estado.toUpperCase()}
            </IonBadge>
          </div>

          {/* Contenedor de la información explayada */}
          <div className="modal-pet-body">
            
            <div className="modal-pet-header">
              <h1>{pet.nombre}</h1>
              <div className="modal-pet-taxonomia">
                <IonIcon icon={pawOutline} />
                <span>{pet.especie} {pet.raza ? `• ${pet.raza}` : ''}</span>
              </div>
            </div>

            {/* Grid de píldoras de información */}
            <div className="modal-pet-stats-grid">
              <div className="modal-stat-card">
                <IonIcon icon={locationOutline} color="primary" />
                <span className="stat-label">Distancia</span>
                <strong className="stat-value">{pet.distanciaKm.toFixed(1)} km</strong>
              </div>
              
              <div className="modal-stat-card">
                <IonIcon icon={personOutline} color="secondary" />
                <span className="stat-label">Reportado por</span>
                <strong className="stat-value">{pet.usuarioId}</strong>
              </div>
            </div>

            {/* Sección de la Descripción Completa */}
            <h3 className="modal-section-title">
              <IonIcon icon={informationCircleOutline} color="primary" />
              Descripción
            </h3>
            <p className="modal-pet-description-text">
              {pet.descripcion || 'Sin descripción adicional proporcionada.'}
            </p>

            {/* Botón de acción definitivo */}
            <IonButton 
              expand="block" 
              shape="round" 
              color={isPerdida ? 'primary' : 'success'} 
              onClick={() => setMostrarAlerta(true)}
              className="modal-submit-btn"
            >
              <IonIcon slot="start" icon={isPerdida ? searchOutline : heartOutline} />
              {isPerdida ? '¡Lo encontré!' : '¡Es mío!'}
            </IonButton>

          </div>
        </IonContent>
      </IonModal>

      {/* ALERTA */}
      <IonAlert
        isOpen={mostrarAlerta}
        onDidDismiss={() => setMostrarAlerta(false)}
        header="¿Iniciar contacto?"
        message={`Se enviará una notificación a ${pet.usuarioId} para coordinar.`}
        buttons={[
          { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
          { text: 'Sí, contactar', handler: () => confirmarContacto() }
        ]}
      />
    </>
  );
};