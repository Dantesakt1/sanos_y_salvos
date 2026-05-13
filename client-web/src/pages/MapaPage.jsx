import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, MapPin } from 'lucide-react';
import L from 'leaflet';
import { useAuth0 } from "@auth0/auth0-react";
import { bffApi } from "../components/api";

// Iconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

export function MapaPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [posicionMapa, setPosicionMapa] = useState([-33.4489, -70.6693]); // Centro por defecto
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar datos reales del BFF
  useEffect(() => {
    const cargarMascotas = async () => {
      try {
        // Usamos la misma función de bffApi que en la HomePage
        const data = await bffApi.getMascotasCercanas(getAccessTokenSilently);
        setMascotas(data);
        
        // Si hay mascotas, centramos el mapa en la primera para que no aparezca vacío
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

  return (
    <div className="mapa-pagina-container">
      {/* Panel Lateral */}
      <aside className="mapa-sidebar">
        <h2 className="titulo-sidebar">Mapa de Reportes</h2>
        
        {cargando ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <Loader2 className="animate-spin" color="var(--morado)" />
          </div>
        ) : (
          <div className="lista-mascotas-mapa">
            {mascotas.length > 0 ? (
              mascotas.map(m => (
                <div 
                  key={m.mascotaId} 
                  className="item-mapa-lista" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setPosicionMapa([m.latitud, m.longitud])}
                >
                  <div className="item-mapa-header">
                    <strong>{m.nombreMascota}</strong>
                    <span className={`mini-etiqueta ${m.estado}`}>{m.estado}</span>
                  </div>
                  <p className="item-mapa-sub">{m.especie} - {m.distanciaKm.toFixed(1)} km</p>
                </div>
              ))
            ) : (
              <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No hay reportes para mostrar.</p>
            )}
          </div>
        )}
      </aside>

      {/* Mapa de OpenStreetMap */}
      <section className="area-visual-mapa">
        <MapContainer center={posicionMapa} zoom={13} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={posicionMapa} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {mascotas.map(m => (
            <Marker key={m.mascotaId} position={[m.latitud, m.longitud]}>
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <img 
                    src={m.fotoUrl || 'https://images.unsplash.com/photo-1543466835-00a732f3804c?w=100'} 
                    alt="pet" 
                    style={{ width: '80px', borderRadius: '5px' }} 
                  />
                  <br />
                  <strong>{m.nombreMascota}</strong><br/>
                  {m.especie} ({m.estado})<br/>
                  <small>Contacto: {m.contactoNombre}</small>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>
    </div>
  );
}