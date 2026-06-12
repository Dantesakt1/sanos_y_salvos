import React, { useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonLabel, IonThumbnail, IonBadge, 
  IonItemSliding, IonItemOptions, IonItemOption, IonIcon,
  IonModal, IonFab, IonFabButton, IonButton, IonInput, IonSelect, IonSelectOption, IonTextarea
} from '@ionic/react';
import { 
  trash, folderOpenOutline, closeOutline, pawOutline, 
  locationOutline, personOutline, informationCircleOutline, 
  pencilOutline, saveOutline, closeCircleOutline
} from 'ionicons/icons';

import { Mascota } from '../components/PetCard'; 

const MisReportesPage: React.FC = () => {
  const [misReportes, setMisReportes] = useState<Mascota[]>([
    {
      id: 101,
      nombre: 'Gato travieso',
      especie: 'Gato',
      raza: 'Mestizo',
      estado: 'encontrada',
      latitud: -33.45,
      longitud: -70.66,
      descripcion: 'Lo encontré atrapado en el techo de la casa vecina. Está a salvo pero asustado.',
      usuarioId: 'dante_123',
      fotoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
      distanciaKm: 0
    }
  ]);

  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [editForm, setEditForm] = useState<Mascota | null>(null);

  const eliminarReporte = (id: number) => {
    setMisReportes(misReportes.filter(r => r.id !== id));
  };

  const abrirDetalle = (mascota: Mascota) => {
    setMascotaSeleccionada(mascota);
    setEditForm({ ...mascota }); 
    setIsEditing(false); 
    setMostrarModal(true);
  };

  const handleActivarEdicion = () => {
    setIsEditing(true);
  };

  const handleCancelarEdicion = () => {
    if (mascotaSeleccionada) {
      setEditForm({ ...mascotaSeleccionada }); 
    }
    setIsEditing(false);
  };

  const handleGuardarCambios = () => {
    if (!editForm) return;

    console.log("JSON listo para enviar vía PUT al BFF:", editForm);
    setMisReportes(misReportes.map(r => r.id === editForm.id ? editForm : r));
    setMascotaSeleccionada(editForm);
    setIsEditing(false);
    setMostrarModal(false); 
    alert("Reporte actualizado con éxito (Simulado)");
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="light" style={{ paddingTop: '25px', paddingBottom: '10px' }}>
          <div className="mis-reportes-header-text" style={{ padding: '0 20px' }}>
            <span className="mis-reportes-header-sub">Tu historial de actividad</span>
            <span className="mis-reportes-header-title">Mis Reportes</span>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">
        
        {/* Cápsula interactiva de instrucciones en lugar de letras gigantes feas */}
        <div className="mis-reportes-instruction-box">
          Toca una publicación para gestionar los datos o desliza el elemento hacia la izquierda si deseas dar de baja el reporte.
        </div>

        <IonList className="mis-reportes-list" lines="none">
          {misReportes.length === 0 ? (
            <div className="mis-reportes-empty-state">
              <IonIcon icon={folderOpenOutline} className="mis-reportes-empty-icon" />
              <h2 style={{ margin: '0 0 10px 0', color: '#334155', fontWeight: 'bold' }}>Historial limpio</h2>
              <p style={{ margin: 0 }}>Tus reportes activos aparecerán aquí.</p>
            </div>
          ) : (
            misReportes.map(reporte => (
              <IonItemSliding key={reporte.id} className="mis-reportes-item-sliding">
                
                <IonItem button onClick={() => abrirDetalle(reporte)} className="mis-reportes-item" detail={false}>
                  <IonThumbnail slot="start" className="mis-reportes-thumbnail">
                    <img alt={reporte.nombre} src={reporte.fotoUrl} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  </IonThumbnail>
                  
                  <IonLabel>
                    <h2 className="mis-reportes-item-title">{reporte.nombre}</h2>
                    <p className="mis-reportes-item-subtitle">
                      {reporte.especie} {reporte.raza ? `• ${reporte.raza}` : ''}
                    </p>
                  </IonLabel>
                  
                  <IonBadge 
                    slot="end" 
                    color={reporte.estado === 'perdida' ? 'danger' : 'success'}
                    className="mis-reportes-badge"
                  >
                    {reporte.estado.toUpperCase()}
                  </IonBadge>
                </IonItem>

                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={() => eliminarReporte(reporte.id)} style={{ padding: '0 25px' }}>
                    <IonIcon slot="icon-only" icon={trash} style={{ fontSize: '1.5rem' }} />
                  </IonItemOption>
                </IonItemOptions>

              </IonItemSliding>
            ))
          )}
        </IonList>

        {/* Modal de Detalle / Edición */}
        <IonModal isOpen={mostrarModal} onDidDismiss={() => setMostrarModal(false)}>
          {mascotaSeleccionada && editForm && (
            <IonContent color="light">
              
              {!isEditing && (
                <IonFab vertical="top" horizontal="end" slot="fixed" className="modal-close-fab">
                  <IonFabButton color="light" size="small" onClick={() => setMostrarModal(false)}>
                    <IonIcon icon={closeOutline} />
                  </IonFabButton>
                </IonFab>
              )}

              <div className="modal-pet-banner">
                <img src={editForm.fotoUrl} alt={editForm.nombre} />
                <div className="modal-pet-gradient"></div>
                <IonBadge className={editForm.estado === 'perdida' ? 'pet-card-badge-perdida modal-badge-pos' : 'pet-card-badge-encontrada modal-badge-pos'}>
                  {editForm.estado.toUpperCase()}
                </IonBadge>
              </div>

              <div className="modal-pet-body">
                
                {isEditing ? (
                  <div className="reportar-form" style={{ marginTop: '10px' }}>
                    <h2 style={{ fontWeight: '900', color: '#111827', margin: '0 0 15px 0' }}>Editar Información</h2>
                    
                    <IonItem lines="none" className="reportar-item-card">
                      <IonSelect 
                        label="Estado" labelPlacement="floating" value={editForm.estado} 
                        onIonChange={e => setEditForm({...editForm, estado: e.detail.value})}
                      >
                        <IonSelectOption value="perdida">Mascota Perdida</IonSelectOption>
                        <IonSelectOption value="encontrada">Mascota Encontrada</IonSelectOption>
                      </IonSelect>
                    </IonItem>

                    <IonItem lines="none" className="reportar-item-card">
                      <IonInput 
                        label="Nombre" labelPlacement="floating" value={editForm.nombre} 
                        onIonInput={e => setEditForm({...editForm, nombre: e.detail.value as string})} 
                      />
                    </IonItem>

                    <IonItem lines="none" className="reportar-item-card">
                      <IonInput 
                        label="Raza" labelPlacement="floating" value={editForm.raza} 
                        onIonInput={e => setEditForm({...editForm, raza: e.detail.value as string})} 
                      />
                    </IonItem>

                    <IonItem lines="none" className="reportar-item-card">
                      <IonTextarea 
                        label="Descripción o señas" labelPlacement="floating" rows={3} value={editForm.descripcion} 
                        onIonInput={e => setEditForm({...editForm, descripcion: e.detail.value as string})} 
                      />
                    </IonItem>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <IonButton expand="block" shape="round" color="light" onClick={handleCancelarEdicion} style={{ flex: 1, height: '50px', fontWeight: 'bold' }}>
                        <IonIcon slot="start" icon={closeCircleOutline} />
                        Cancelar
                      </IonButton>
                      <IonButton expand="block" shape="round" color="success" onClick={handleGuardarCambios} style={{ flex: 1, height: '50px', fontWeight: 'bold' }}>
                        <IonIcon slot="start" icon={saveOutline} />
                        Guardar
                      </IonButton>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="modal-pet-header">
                      <h1>{editForm.nombre}</h1>
                      <div className="modal-pet-taxonomia">
                        <IonIcon icon={pawOutline} />
                        <span>{editForm.especie} {editForm.raza ? `• ${editForm.raza}` : ''}</span>
                      </div>
                    </div>

                    <div className="modal-pet-stats-grid">
                      <div className="modal-stat-card">
                        <IonIcon icon={locationOutline} color="primary" />
                        <span className="stat-label">Distancia</span>
                        <strong className="stat-value">{editForm.distanciaKm.toFixed(1)} km</strong>
                      </div>
                      <div className="modal-stat-card">
                        <IonIcon icon={personOutline} color="secondary" />
                        <span className="stat-label">Reportado por</span>
                        <strong className="stat-value">Tú ({editForm.usuarioId})</strong>
                      </div>
                    </div>

                    <h3 className="modal-section-title">
                      <IonIcon icon={informationCircleOutline} color="primary" />
                      Descripción
                    </h3>
                    <p className="modal-pet-description-text">
                      {editForm.descripcion || 'Sin descripción adicional proporcionada.'}
                    </p>

                    <IonButton 
                      expand="block" 
                      shape="round" 
                      color="primary" 
                      onClick={handleActivarEdicion}
                      className="modal-submit-btn"
                    >
                      <IonIcon slot="start" icon={pencilOutline} />
                      Editar Reporte
                    </IonButton>
                  </>
                )}

              </div>
            </IonContent>
          )}
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default MisReportesPage;