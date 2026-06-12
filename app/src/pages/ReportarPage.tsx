import React, { useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonInput, IonSelect, IonSelectOption, 
  IonButton, IonTextarea, IonIcon 
} from '@ionic/react';
import { cameraOutline, sendOutline, pawOutline, alertCircleOutline } from 'ionicons/icons';

const ReportarPage: React.FC = () => {
  // ESTADO INTACTO: Alineado 1:1 con tu modelo Mascota.java
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    estado: 'perdida',
    latitud: -33.45,
    longitud: -70.66,
    descripcion: '',
    usuarioId: 'dante_123', 
    fotoUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("JSON listo para el @RequestBody en Spring Boot:", formData);
    alert("Reporte guardado (Simulado)");
  };

  return (
    <IonPage>
      {/* Header minimalista con tipografía moderna */}
      <IonHeader className="ion-no-border">
        <IonToolbar color="light" style={{ paddingTop: '12px', paddingBottom: '6px' }}>
          <IonTitle style={{ fontWeight: '900', fontSize: '1.4rem', color: 'var(--ion-color-primary)', letterSpacing: '-0.5px' }}>
            Nuevo Reporte
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" className="ion-padding">
        
        {/* Banner Invitacional Premium que unifica la estética */}
        <div className="reportar-banner">
          <IonIcon icon={pawOutline} className="reportar-banner-icon" />
          <h2>Crear Publicación</h2>
          <p>Ingresa los datos para activar el motor geográfico de búsqueda.</p>
        </div>

        <form onSubmit={handleSubmit} className="reportar-form">
          
          {/* Campo: Estado */}
          <IonItem lines="none" className="reportar-item-card">
            <IonSelect 
              label="¿Cuál es la situación?" 
              labelPlacement="floating" 
              value={formData.estado}
              onIonChange={e => setFormData({...formData, estado: e.detail.value})}
            >
              <IonSelectOption value="perdida">Mascota Perdida (Busco a mi compañero)</IonSelectOption>
              <IonSelectOption value="encontrada">Mascota Encontrada (Quiero reportar un avistamiento)</IonSelectOption>
            </IonSelect>
          </IonItem>

          {/* Campo: Nombre */}
          <IonItem lines="none" className="reportar-item-card">
            <IonInput 
              label="Nombre del animal" 
              labelPlacement="floating" 
              placeholder="Escribe 'Desconocido' si no lo sabes..."
              value={formData.nombre}
              onIonInput={e => setFormData({...formData, nombre: e.detail.value as string})}
            />
          </IonItem>

          {/* Campo: Especie */}
          <IonItem lines="none" className="reportar-item-card">
            <IonSelect 
              label="Especie" 
              labelPlacement="floating"
              value={formData.especie}
              onIonChange={e => setFormData({...formData, especie: e.detail.value})}
            >
              <IonSelectOption value="Perro">Perro</IonSelectOption>
              <IonSelectOption value="Gato">Gato</IonSelectOption>
              <IonSelectOption value="Otro">Otro / Exótico</IonSelectOption>
            </IonSelect>
          </IonItem>

          {/* Campo: Raza */}
          <IonItem lines="none" className="reportar-item-card">
            <IonInput 
              label="Raza" 
              labelPlacement="floating" 
              placeholder="Ej: Mestizo, Siamés, Poodle..."
              value={formData.raza}
              onIonInput={e => setFormData({...formData, raza: e.detail.value as string})}
            />
          </IonItem>

          {/* Campo: Descripción */}
          <IonItem lines="none" className="reportar-item-card">
            <IonTextarea 
              label="Descripción detallada o señas" 
              labelPlacement="floating" 
              rows={4}
              placeholder="Color de pelaje, collares, cicatrices, comportamiento o dirección aproximada..."
              value={formData.descripcion}
              onIonInput={e => setFormData({...formData, descripcion: e.detail.value as string})}
            />
          </IonItem>

          {/* Zona Interactiva de Carga de Archivos (Activando tus clases CSS ocultas) */}
          <div className="reportar-dropzone" style={{ cursor: 'pointer' }}>
            <div className="reportar-icon-circle">
              <IonIcon icon={cameraOutline} />
            </div>
            <h3>Subir una fotografía clara</h3>
            <p>Formatos aceptados: JPG, PNG. Máximo 5MB.</p>
          </div>

          {/* Información del emisor simulada para transparencia de UX */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 8px', color: '#8c96a3', fontSize: '0.8rem', marginBottom: '10px' }}>
            <IonIcon icon={alertCircleOutline} style={{ fontSize: '1rem' }} />
            <span>Publicando como ID de cuenta único: <b>{formData.usuarioId}</b></span>
          </div>

          {/* Botón de Envío Definitivo */}
          <IonButton 
            expand="block" 
            type="submit" 
            color="primary" 
            className="reportar-submit-btn"
            style={{ '--border-radius': '20px' }}
          >
            <IonIcon icon={sendOutline} slot="start" />
            Publicar Reporte
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default ReportarPage;