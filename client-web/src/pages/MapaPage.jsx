import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, MapPin, Phone, Info } from 'lucide-react';
import L from 'leaflet';
import { useAuth0 } from "@auth0/auth0-react";
import { bffApi } from "../components/api";

// Reparación de iconos de Leaflet (Problema común en React)
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
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 15);
  }, [center, map]);
  return null;
}

export function MapaPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [posicionMapa, setPosicionMapa] = useState([-33.4489, -70.6693]);
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarMascotas = async () => {
      try {
        const data = await bffApi.getMascotasCercanas(getAccessTokenSilently);
        setMascotas(data);
        if (data.length > 0) {
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
  const handleImgError = (e, especie) => {
    e.target.onerror = null;
    e.target.src = especie === 'Gato' 
      ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200' 
      : 'https://images.unsplash.com/photo-1543466835-00a732f3804c?w=200';
  };

  return (
    <div className="mapa-layout">
      {/* Sidebar con SCROLL corregido */}
      <aside className="mapa-sidebar">
        <div className="sidebar-header">
          <h2><MapPin size={24} color="var(--morado)" /> Reportes Cercanos</h2>
          <p>{mascotas.length} mascotas encontradas cerca</p>
        </div>
        
        <div className="sidebar-lista-scrollable">
          {cargando ? (
            <div className="loader-box"><Loader2 className="animate-spin" /></div>
          ) : mascotas.length > 0 ? (
            mascotas.map(m => (
              <div 
                key={m.mascotaId} 
                className={`item-lista-mapa ${posicionMapa[0] === m.latitud ? 'seleccionado' : ''}`}
                onClick={() => setPosicionMapa([m.latitud, m.longitud])}
              >
                <img 
                  src={m.fotoUrl} 
                  onError={(e) => handleImgError(e, m.especie)}
                  alt="thumb"
                  className="mini-thumb"
                />
                <div className="item-info">
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <strong>{m.nombreMascota}</strong>
                    <span className={`tag-estado ${m.estado}`}>{m.estado.toUpperCase()}</span>
                  </div>
                  <p>{m.especie} • a {m.distanciaKm.toFixed(1)} km</p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-vacio">No hay reportes en esta zona.</p>
          )}
        </div>
      </aside>

      {/* Área del Mapa */}
      <section className="mapa-container-visual">
        <MapContainer center={posicionMapa} zoom={13} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={posicionMapa} />
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          
          {mascotas.map(m => (
            <Marker key={m.mascotaId} position={[m.latitud, m.longitud]}>
              <Popup className="custom-popup">
                <div className="popup-content">
                  <img 
                    src={m.fotoUrl} 
                    onError={(e) => handleImgError(e, m.especie)}
                    alt="pet" 
                  />
                  <div className="popup-text">
                    <h3>{m.nombreMascota}</h3>
                    <p className={`status ${m.estado}`}>{m.estado.toUpperCase()}</p>
                    <div className="contact-info">
                      <Phone size={12} /> {m.contactoTelefono}
                    </div>
                    <div className="contact-info">
                      <Info size={12} /> {m.contactoNombre}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>
    </div>
  );
}