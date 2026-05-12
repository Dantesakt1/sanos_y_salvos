import React from 'react';
import { Search, MapPin, Filter } from 'lucide-react';

export function MapaPage() {
  const mascotasMapa = [
    { id: 1, nombre: 'Max', tipo: 'perdida', raza: 'Perro - Dorado', coord: '-33.4172, -70.6069' },
    { id: 2, nombre: 'Luna', tipo: 'encontrada', raza: 'Gato - Blanco', coord: '-33.4269, -70.6133' },
    { id: 3, nombre: 'Rocky', tipo: 'perdida', raza: 'Perro - Negro', coord: '-33.4089, -70.5988' }
  ];

  return (
    <div className="mapa-pagina-container">
      {/* Panel Lateral Izquierdo */}
      <aside className="mapa-sidebar">
        <h2 className="titulo-sidebar">Mapa de Reportes</h2>
        
        <div className="buscador-mapa-wrapper">
          <Search size={18} className="icono-buscador" />
          <input type="text" placeholder="Buscar por ubicación..." className="input-mapa-buscar" />
        </div>

        <div className="filtros-mapa-botones">
          <button className="btn-filtro activo">Todas</button>
          <button className="btn-filtro">Perdidas</button>
          <button className="btn-filtro">Encontradas</button>
        </div>

        <div className="lista-mascotas-mapa">
          {mascotasMapa.map(m => (
            <div key={m.id} className="item-mapa-lista">
              <div className="item-mapa-header">
                <strong>{m.nombre}</strong>
                <span className={`mini-etiqueta ${m.tipo}`}>{m.tipo}</span>
              </div>
              <p className="item-mapa-sub">{m.raza}</p>
              <div className="item-mapa-coord">
                <MapPin size={12} /> {m.coord}
              </div>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">Mostrando {mascotasMapa.length} reportes</div>
      </aside>

      {/* Área del Mapa */}
      <section className="area-visual-mapa">
        <div className="placeholder-mapa-interactivo">
          <div className="mapa-card-info">
             <MapPin size={40} color="var(--morado)" />
             <h3>Mapa Interactivo</h3>
             <p>Aquí se mostrará el mapa con las ubicaciones reales.</p>
          </div>
          
          {/* Pines flotantes de ejemplo */}
          <div className="pin-flotante p1"><MapPin fill="var(--rojo-alerta)" /></div>
          <div className="pin-flotante p2"><MapPin fill="var(--verde-exito)" /></div>
        </div>
      </section>
    </div>
  );
}