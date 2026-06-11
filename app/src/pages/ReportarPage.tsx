import React, { useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, 
  IonButton, IonTextarea, IonIcon 
} from '@ionic/react';
import { cameraOutline, sendOutline } from 'ionicons/icons';

const ReportarPage: React.FC = () => {
  // Estado estructurado pensando en el Backend
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    estado: 'perdida',
    raza: '',
    descripcion: '',
    latitud: -33.45, // Default Santiago por ahora
    longitud: -70.66
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos listos para enviar al BFF:", formData);
    // Aquí a futuro: bffApi.crearReporte(formData)
    alert("Reporte guardado (Simulado)");
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonTitle style={{ fontWeight: 'bold' }}>Nuevo Reporte</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" className="ion-padding">
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#111827', marginTop: 0 }}>Datos de la mascota</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '-5px' }}>
            Completa la información para que el motor de coincidencias haga su magia.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Selector de Estado (Perdida / Encontrada) */}
          <IonItem style={{ borderRadius: '12px', marginBottom: '15px' }} lines="none">
            <IonSelect 
              label="Tipo de reporte" 
              labelPlacement="floating" 
              value={formData.estado}
              onIonChange={e => setFormData({...formData, estado: e.detail.value})}
            >
              <IonSelectOption value="perdida">Mascota Perdida</IonSelectOption>
              <IonSelectOption value="encontrada">Mascota Encontrada</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem style={{ borderRadius: '12px', marginBottom: '15px' }} lines="none">
            <IonInput 
              label="Nombre (si lo sabes)" 
              labelPlacement="floating" 
              placeholder="Ej: Michi, Firulais..."
              value={formData.nombre}
              onIonInput={e => setFormData({...formData, nombre: e.detail.value as string})}
            ></IonInput>
          </IonItem>

          <IonItem style={{ borderRadius: '12px', marginBottom: '15px' }} lines="none">
            <IonSelect 
              label="Especie" 
              labelPlacement="floating"
              value={formData.especie}
              onIonChange={e => setFormData({...formData, especie: e.detail.value})}
            >
              <IonSelectOption value="Perro">Perro</IonSelectOption>
              <IonSelectOption value="Gato">Gato</IonSelectOption>
              <IonSelectOption value="Otro">Otro</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem style={{ borderRadius: '12px', marginBottom: '15px' }} lines="none">
            <IonTextarea 
              label="Descripción o señas particulares" 
              labelPlacement="floating" 
              rows={3}
              value={formData.descripcion}
              onIonInput={e => setFormData({...formData, descripcion: e.detail.value as string})}
            ></IonTextarea>
          </IonItem>

          {/* Botón simulado para subir foto */}
          <IonButton expand="block" fill="outline" color="primary" style={{ marginBottom: '20px', height: '50px' }}>
            <IonIcon icon={cameraOutline} slot="start" />
            Subir Fotografía
          </IonButton>

          <IonButton expand="block" type="submit" color="primary" style={{ height: '50px', fontWeight: 'bold' }}>
            <IonIcon icon={sendOutline} slot="start" />
            Publicar Reporte
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default ReportarPage;