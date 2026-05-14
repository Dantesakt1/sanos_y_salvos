import React, { useState, useEffect } from 'react';
import { Eye, Edit3, Trash2, Calendar, MapPin, Loader2 } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import { bffApi } from "../components/api";

export function MisReportesPage() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    const fetchMisReportes = async () => {
      if (!user?.sub) return;

      try {
        setCargando(true);
        const data = await bffApi.getMisReportes(getAccessTokenSilently, user.sub);
        setReportes(data || []);
      } catch (error) {
        console.error("Error cargando mis reportes:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchMisReportes();
  }, [getAccessTokenSilently, user?.sub]);

  const eliminarReporte = async (id) => {
    if(window.confirm("¿Estás seguro de eliminar este reporte?")) {
        try {
            // Cuando conectes el delete real, lo pones aquí
            alert("Reporte eliminado (Simulado)");
            setReportes(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            alert("No se pudo eliminar el reporte");
        }
    }
  };

  const reportesFiltrados = filtro === 'todos' 
    ? reportes 
    : reportes.filter(r => r.estado && r.estado.toLowerCase() === filtro.toLowerCase());

  return (
    <div className="mis-reportes-container">
      <header className="page-header">
        <h1>Mis Reportes</h1>
        <p>Gestiona tus publicaciones, {user?.nickname || 'Usuario'}.</p>
      </header>

      <div className="filtros-bar">
        <div className="tabs-container">
          <button className={`tab-btn ${filtro === 'todos' ? 'activo' : ''}`} onClick={() => setFiltro('todos')}>
            Todos ({reportes.length})
          </button>
          <button className={`tab-btn ${filtro === 'perdida' ? 'activo' : ''}`} onClick={() => setFiltro('perdida')}>
            Perdidos ({reportes.filter(r => r.estado && r.estado.toLowerCase() === 'perdida').length})
          </button>
          <button className={`tab-btn ${filtro === 'encontrada' ? 'activo' : ''}`} onClick={() => setFiltro('encontrada')}>
            Encontrados ({reportes.filter(r => r.estado && r.estado.toLowerCase() === 'encontrada').length})
          </button>
        </div>
      </div>

      {cargando ? (
        <div style={{display: 'flex', justifyContent: 'center', padding: '50px'}}>
          <Loader2 className="animate-spin" size={40} color="var(--morado)" />
        </div>
      ) : (
        <div className="reportes-lista-vertical">
          {reportesFiltrados.length > 0 ? reportesFiltrados.map((reporte) => (
            <div key={reporte.id} className={`reporte-card-horizontal ${reporte.estado.toLowerCase()}`}>
              <div className="card-image-section" style={{ overflow: 'hidden' }}>
                <img 
                  src={reporte.fotoUrl || (reporte.especie === 'Gato' 
                    ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' 
                    : 'https://images.unsplash.com/photo-1543466835-00a732f3804c?w=400')} 
                  alt={reporte.nombre} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = reporte.especie === 'Gato' 
                      ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' 
                      : 'https://images.unsplash.com/photo-1543466835-00a732f3804c?w=400';
                  }}
                />
              </div>

              <div className="card-info-section">
                <div className="info-top">
                  <div className="title-group">
                    <h2>
                        {reporte.nombre} 
                        <span className={`tag-${reporte.estado.toLowerCase()}`}>
                            {reporte.estado.toUpperCase()}
                        </span>
                    </h2>
                    <p className="raza-text">{reporte.especie} {reporte.raza ? `- ${reporte.raza}` : ''}</p>
                  </div>
                </div>

                <div className="info-meta" style={{ marginBottom: '25px' }}>
                  <span><MapPin size={16} /> Ubicación registrada</span>
                  <span><Calendar size={16} /> ID Registro: {reporte.id}</span>
                </div>

                {/* EL BLOQUE DE "ANALIZANDO COINCIDENCIAS" FUE ELIMINADO */}

                <div className="acciones-buttons">
                  <button className="btn-action purple"><Eye size={16} /> Ver Detalles</button>
                  <button className="btn-action gray"><Edit3 size={16} /> Editar</button>
                  <button className="btn-action red-trash" onClick={() => eliminarReporte(reporte.id)}>
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div style={{textAlign: 'center', padding: '40px', color: '#666', background: '#fff', borderRadius: '15px'}}>
                <p>No tienes reportes activos en este momento.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}