import React, { useState } from 'react';
import { Eye, Edit3, CheckCircle, Trash2, Calendar, MapPin, Search, Zap } from 'lucide-react';

export function MisReportesPage() {
  const [filtro, setFiltro] = useState('todos');

  const misReportes = [
    {
      id: 1,
      nombre: 'Max',
      tipo: 'perdida',
      raza: 'Perro - Golden Retriever',
      ubicacion: 'Las Condes, Santiago',
      fecha: '09-05-2026',
      vistas: 234,
      estado: 'activo',
      coincidencias: 3,
      img: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400'
    },
    {
      id: 2,
      nombre: 'Luna',
      tipo: 'perdida',
      raza: 'Gato - Persa',
      ubicacion: 'Vitacura, Santiago',
      fecha: '27-04-2026',
      vistas: 567,
      estado: 'resuelto',
      fechaResuelto: '04-05-2026',
      img: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400'
    }
  ];

  const reportesFiltrados = filtro === 'todos' 
    ? misReportes 
    : misReportes.filter(r => r.estado === filtro);

  return (
    <div className="mis-reportes-container">
      <header className="page-header">
        <h1>Mis Reportes</h1>
        <p>Gestiona tus reportes de mascotas perdidas y encontradas</p>
      </header>

      {/* Barra de Filtros (Captura 105434) */}
      <div className="filtros-bar">
        <div className="tabs-container">
          <button className={`tab-btn ${filtro === 'todos' ? 'activo' : ''}`} onClick={() => setFiltro('todos')}>
            Todos ({misReportes.length})
          </button>
          <button className={`tab-btn ${filtro === 'activo' ? 'activo' : ''}`} onClick={() => setFiltro('activo')}>
            Activos ({misReportes.filter(r => r.estado === 'activo').length})
          </button>
          <button className={`tab-btn ${filtro === 'resuelto' ? 'activo' : ''}`} onClick={() => setFiltro('resuelto')}>
            Resueltos ({misReportes.filter(r => r.estado === 'resuelto').length})
          </button>
        </div>
        <select className="sort-select">
          <option>Más recientes</option>
          <option>Más antiguos</option>
        </select>
      </div>

      {/* Lista de Reportes */}
      <div className="reportes-lista-vertical">
        {reportesFiltrados.map(reporte => (
          <div key={reporte.id} className={`reporte-card-horizontal ${reporte.estado}`}>
            <div className="card-image-section">
              <img src={reporte.img} alt={reporte.nombre} />
              {reporte.estado === 'resuelto' && (
                <div className="overlay-resuelto">
                  <CheckCircle size={48} />
                  <span>RESUELTO</span>
                </div>
              )}
            </div>

            <div className="card-info-section">
              <div className="info-top">
                <div className="title-group">
                  <h2>{reporte.nombre} <span className="tag-perdida">PERDIDA</span></h2>
                  <p className="raza-text">{reporte.raza}</p>
                </div>
              </div>

              <div className="info-meta">
                <span><MapPin size={16} /> {reporte.ubicacion}</span>
                <span><Calendar size={16} /> {reporte.fecha}</span>
                <span><Eye size={16} /> {reporte.vistas} vistas</span>
              </div>

              {reporte.estado === 'activo' ? (
                <>
                  <div className="alerta-coincidencias">
                    <Zap size={16} fill="currentColor" /> {reporte.coincidencias} posibles coincidencias detectadas
                  </div>
                  <div className="acciones-buttons">
                    <button className="btn-action purple"><Eye size={16} /> Ver Detalles</button>
                    <button className="btn-action green"><Search size={16} /> Ver Coincidencias</button>
                    <button className="btn-action gray"><Edit3 size={16} /> Editar</button>
                    <button className="btn-action light-green"><CheckCircle size={16} /> Marcar como Resuelto</button>
                    <button className="btn-action red-trash"><Trash2 size={16} /> Eliminar</button>
                  </div>
                </>
              ) : (
                <div className="resuelto-status-bar">
                  <CheckCircle size={16} /> Resuelto el {reporte.fechaResuelto}
                  <div className="acciones-buttons" style={{marginTop: '20px'}}>
                    <button className="btn-action purple"><Eye size={16} /> Ver Detalles</button>
                    <button className="btn-action red-trash"><Trash2 size={16} /> Eliminar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}