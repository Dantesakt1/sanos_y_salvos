import React, { useState, useEffect, useRef } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonInput, IonSelect, IonSelectOption, 
  IonButton, IonTextarea, IonIcon, IonSpinner
} from '@ionic/react';
import { 
  cameraOutline, sendOutline, pawOutline, alertCircleOutline, 
  closeCircle, locationOutline 
} from 'ionicons/icons';
import { useAuth0 } from '@auth0/auth0-react'; 

const ReportarPage: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  // 1. REFERENCIA Y ESTADOS PARA LA IMAGEN (Importados de tu web)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    estado: 'perdida',
    latitud: -33.45, 
    longitud: -70.66,
    descripcion: '',
    telefonoContacto: '', // Agregado de tu web
    usuarioId: '', 
    fotoUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.sub) {
      setFormData(prev => ({ ...prev, usuarioId: user.sub || '' }));
    }
  }, [user]);

  const API_BFF_URL = 'http://localhost:8085/api/bff/reportar';

  // 2. FUNCIÓN PARA MANEJAR LA SELECCIÓN DEL ARCHIVO
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
      const urlTemporal = URL.createObjectURL(file);
      setPreview(urlTemporal);
    }
  };

  // 3. FUNCIÓN DE GEOLOCALIZACIÓN (Adaptada a Ionic)
  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({
          ...prev,
          latitud: pos.coords.latitude,
          longitud: pos.coords.longitude
        }));
        alert("¡Ubicación capturada correctamente!");
      }, 
      (error) => {
        alert("Error al obtener ubicación. Por favor, activa el GPS.");
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let fotoUrlNube = '';

      // 4. LÓGICA DE CLOUDINARY
      if (imagenFile) {
        const formCloudinary = new FormData();
        formCloudinary.append("file", imagenFile);
        formCloudinary.append("upload_preset", "sanos_y_salvos"); 
        
        try {
          const resCloudinary = await fetch("https://api.cloudinary.com/v1_1/ddjllde8k/image/upload", {
            method: "POST",
            body: formCloudinary,
          });
          const dataCloudinary = await resCloudinary.json();
          fotoUrlNube = dataCloudinary.secure_url; 
          console.log("Foto subida a Cloudinary:", fotoUrlNube);
        } catch (err) {
          console.error("Error subiendo foto a Cloudinary", err);
          alert("Hubo un problema subiendo la foto, pero publicaremos el reporte igual.");
        }
      }

      // 5. ARMAMOS EL OBJETO FINAL
      const mascotaParaEnviar = {
        ...formData,
        fotoUrl: fotoUrlNube, // Asignamos la URL real de Cloudinary
      };

      const token = await getAccessTokenSilently();

      const response = await fetch(API_BFF_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(mascotaParaEnviar)
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor BFF: ${response.status}`);
      }
      
      alert("¡Reporte publicado con éxito en la red de búsqueda!");

      // Limpieza post-envío
      setFormData({
        nombre: '', especie: '', raza: '', estado: 'perdida',
        latitud: -33.45, longitud: -70.66, descripcion: '', telefonoContacto: '',
        usuarioId: user?.sub || '', fotoUrl: ''
      });
      setPreview(null);
      setImagenFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error) {
      console.error("Error al enviar el reporte:", error);
      alert("Hubo un problema al intentar publicar el reporte.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="light" style={{ paddingTop: '12px', paddingBottom: '6px' }}>
          <IonTitle style={{ fontWeight: '900', fontSize: '1.4rem', color: 'var(--ion-color-primary)', letterSpacing: '-0.5px' }}>
            Nuevo Reporte
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" className="ion-padding">
        
        <div className="reportar-banner">
          <IonIcon icon={pawOutline} className="reportar-banner-icon" />
          <h2>Crear Publicación</h2>
          <p>Ingresa los datos para activar el motor geográfico de búsqueda.</p>
        </div>

        <form onSubmit={handleSubmit} className="reportar-form">
          
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

          <IonItem lines="none" className="reportar-item-card">
            <IonInput 
              label="Nombre del animal" 
              labelPlacement="floating" 
              placeholder="Escribe 'Desconocido' si no lo sabes..."
              value={formData.nombre}
              onIonInput={e => setFormData({...formData, nombre: e.detail.value as string})}
            />
          </IonItem>

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

          <IonItem lines="none" className="reportar-item-card">
            <IonInput 
              label="Raza" 
              labelPlacement="floating" 
              placeholder="Ej: Mestizo, Siamés, Poodle..."
              value={formData.raza}
              onIonInput={e => setFormData({...formData, raza: e.detail.value as string})}
            />
          </IonItem>

          <IonItem lines="none" className="reportar-item-card">
            <IonInput 
              label="Teléfono de Contacto" 
              labelPlacement="floating" 
              type="tel"
              placeholder="Ej: +56912345678"
              value={formData.telefonoContacto}
              onIonInput={e => setFormData({...formData, telefonoContacto: e.detail.value as string})}
            />
          </IonItem>

          <IonItem lines="none" className="reportar-item-card">
            <IonTextarea 
              label="Descripción detallada o señas" 
              labelPlacement="floating" 
              rows={3}
              placeholder="Color de pelaje, collares, cicatrices..."
              value={formData.descripcion}
              onIonInput={e => setFormData({...formData, descripcion: e.detail.value as string})}
            />
          </IonItem>

          {/* BOTÓN DE GEOLOCALIZACIÓN */}
          <IonButton 
            expand="block" 
            fill="outline" 
            color={formData.latitud !== -33.45 ? "success" : "primary"}
            onClick={obtenerUbicacion}
            style={{ marginBottom: '15px', '--border-radius': '12px' }}
          >
            <IonIcon icon={locationOutline} slot="start" />
            {formData.latitud !== -33.45 ? 'Ubicación Capturada ✓' : 'Capturar Ubicación Actual'}
          </IonButton>

          {/* ZONA DE CARGA DE IMAGEN MEJORADA */}
          <div 
            className="reportar-dropzone" 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              cursor: 'pointer', 
              position: 'relative', 
              minHeight: '160px', 
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            
            {preview ? (
              <>
                <img 
                  src={preview} 
                  alt="Vista previa" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <IonButton 
                  fill="clear" 
                  onClick={(e) => { 
                    e.stopPropagation(); // Evita que al hacer clic en la X se abra de nuevo el buscador de archivos
                    setPreview(null); 
                    setImagenFile(null); 
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  style={{ 
                    position: 'absolute', top: '5px', right: '5px', 
                    '--background': 'rgba(0,0,0,0.6)', '--border-radius': '50%', '--padding-start': '8px', '--padding-end': '8px' 
                  }}
                >
                  <IonIcon icon={closeCircle} color="light" style={{ fontSize: '24px' }} />
                </IonButton>
              </>
            ) : (
              <>
                <div className="reportar-icon-circle">
                  <IonIcon icon={cameraOutline} />
                </div>
                <h3>Subir una fotografía clara</h3>
                <p>Formatos aceptados: JPG, PNG. Máximo 5MB.</p>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 8px', color: '#8c96a3', fontSize: '0.8rem', marginBottom: '10px' }}>
            <IonIcon icon={alertCircleOutline} style={{ fontSize: '1rem' }} />
            <span>ID de cuenta: <b>{formData.usuarioId ? formData.usuarioId.substring(0, 15) + "..." : "Cargando..."}</b></span>
          </div>

          <IonButton 
            expand="block" 
            type="submit" 
            color="primary" 
            disabled={isSubmitting}
            className="reportar-submit-btn"
            style={{ '--border-radius': '20px' }}
          >
            {isSubmitting ? (
              <IonSpinner name="crescent" color="light" />
            ) : (
              <>
                <IonIcon icon={sendOutline} slot="start" />
                Publicar Reporte
              </>
            )}
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default ReportarPage;