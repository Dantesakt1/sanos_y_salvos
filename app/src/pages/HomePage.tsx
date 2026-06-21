import React, { useState, useEffect } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonRefresher, IonRefresherContent, RefresherEventDetail,
  IonSearchbar, IonSegment, IonSegmentButton, IonLabel,
  IonButtons, IonButton, IonIcon, IonSpinner
} from '@ionic/react';
import { notificationsOutline } from 'ionicons/icons';
import { useAuth0 } from '@auth0/auth0-react'; // <-- IMPORTAMOS AUTH0 AQUÍ

import { PetCard, Mascota } from '../components/PetCard';

const HomePage: React.FC = () => {
  const [filtro, setFiltro] = useState('todos');
  const [textoBusqueda, setTextoBusqueda] = useState('');
  
  const [reportes, setReportes] = useState<Mascota[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  // Extraemos la función para pedir el token real en silencio
  const { getAccessTokenSilently } = useAuth0(); 

  const API_BFF_URL = 'http://localhost:8085/api/bff/mascotas-cercanas';

  const cargarMascotas = async (event?: CustomEvent<RefresherEventDetail>) => {
    try {
      // AQUÍ ESTÁ LA MAGIA: Pedimos el token JWT real a Auth0
      const token = await getAccessTokenSilently();

      const response = await fetch(API_BFF_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Ahora sí enviamos un pase VIP válido
        }
      });

      if (!response.ok) {
        throw new Error(`Error al conectar con el BFF: ${response.status}`);
      }

      const data = await response.json();

      const mascotasFormateadas: Mascota[] = data.map((item: any) => ({
        id: item.mascotaId,
        nombre: item.nombreMascota,
        especie: item.especie,
        raza: '', 
        estado: item.estado,
        latitud: item.latitud,
        longitud: item.longitud,
        descripcion: item.descripcion,
        usuarioId: item.contactoNombre, 
        fotoUrl: item.fotoUrl || 'https://images.unsplash.com/photo-1543466835-00a732f3804c?w=400',
        distanciaKm: item.distanciaKm
      }));

      setReportes(mascotasFormateadas);
    } catch (error) {
      console.error("Error cargando mascotas desde el BFF:", error);
    } finally {
      setCargando(false);
      if (event) {
        event.detail.complete(); 
      }
    }
  };

  useEffect(() => {
    cargarMascotas();
  }, []);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    cargarMascotas(event);
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

          {cargando ? (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <IonSpinner name="crescent" color="primary" />
              <p style={{ color: '#6b7280', marginTop: '10px' }}>Buscando mascotas cercanas...</p>
            </div>
          ) : reportesFiltrados.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '40px', color: '#6b7280' }}>
              <p>No se encontraron mascotas con esos filtros.</p>
            </div>
          ) : (
            <div style={{ paddingBottom: '20px' }}>
              {reportesFiltrados.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;