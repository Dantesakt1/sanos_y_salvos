import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // ¡Importante para que no se vea roto!
import { Search, MapPin } from 'lucide-react';
import L from 'leaflet';

// Arreglo para los iconos de Leaflet (por defecto a veces no cargan en React)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Componente para mover el mapa cuando haces clic en la lista
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 14);
  return null;
}

export function MapaPage() {
  const [posicionActual, setPosicionActual] = useState([-33.4489, -70.6693]); // Santiago

  const mascotasMapa = [
    { id: 1, nombre: 'Max', tipo: 'perdida', raza: 'Perro - Dorado', lat: -33.4172, lng: -70.6069 },
    { id: 2, nombre: 'Luna', tipo: 'encontrada', raza: 'Gato - Blanco', lat: -33.4269, lng: -70.6133 },
    { id: 3, nombre: 'Rocky', tipo: 'perdida', raza: 'Perro - Negro', lat: -33.4089, lng: -70.5988 }
  ];

  return (
    <div className="mapa-pagina-container">
      {/* Panel Lateral */}
      <aside className="mapa-sidebar">
        <h2 className="titulo-sidebar">Mapa de Reportes</h2>
        <div className="buscador-mapa-wrapper">
          <input type="text" placeholder="Buscar ubicación..." className="input-mapa-buscar" />
        </div>

        <div className="lista-mascotas-mapa">
          {mascotasMapa.map(m => (
            <div 
              key={m.id} 
              className="item-mapa-lista" 
              style={{ cursor: 'pointer' }}
              onClick={() => setPosicionActual([m.lat, m.lng])}
            >
              <div className="item-mapa-header">
                <strong>{m.nombre}</strong>
                <span className={`mini-etiqueta ${m.tipo}`}>{m.tipo}</span>
              </div>
              <p className="item-mapa-sub">{m.raza}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* Mapa de OpenStreetMap */}
      <section className="area-visual-mapa">
        <MapContainer center={posicionActual} zoom={13} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={posicionActual} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mascotasMapa.map(m => (
            <Marker key={m.id} position={[m.lat, m.lng]}>
              <Popup>
                <strong>{m.nombre}</strong><br/>
                {m.raza} ({m.tipo})
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>
    </div>
  );
}