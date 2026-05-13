import React, { useState, useEffect } from 'react';
import { Eye, Edit3, Trash2, Calendar, MapPin, Zap, Loader2 } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import { bffApi } from "../components/api";

export function MisReportesPage() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    const fetchMisReportes = async () => {
      // Esperamos a que Auth0 tenga cargado al usuario
      if (!user?.sub) return;

      try {
        setCargando(true);
        // Llamamos al endpoint del BFF que recibe el usuarioId (String)
        // Nota: Asegúrate de que bffApi tenga implementado getMisReportes
        const data = await bffApi.getMisReportes(getAccessTokenSilently, user.sub);
        setReportes(data);
      } catch (error) {
        console.error("Error cargando mis reportes:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchMisReportes();
  }, [getAccessTokenSilently, user?.sub]); // Se dispara cuando cambia el ID del usuario

  const eliminarReporte = async (id) => {
    if(window.confirm("¿Estás seguro de eliminar este reporte?")) {
        try {
            // Implementar en bffApi: return axios.delete(`${API_URL}/mascotas/${id}`, config);
            // await bffApi.deleteMascota(getAccessTokenSilently, id);
            alert("Reporte eliminado (Simulado)");
            setReportes(prev => prev.filter(r => r.mascotaId !== id));
        } catch (err) {
            alert("No se pudo eliminar el reporte");
        }
    }
  };

  const reportesFiltrados = filtro === 'todos' 
    ? reportes 
    : reportes.filter(r => r.estado.toLowerCase() === filtro.toLowerCase());

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
            Perdidos ({reportes.filter(r => r.estado.toLowerCase() === 'perdida').length})
          </button>
          <button className={`tab-btn ${filtro === 'encontrada' ? 'activo' : ''}`} onClick={() => setFiltro('encontrada')}>
            Encontrados ({reportes.filter(r => r.estado.toLowerCase() === 'encontrada').length})
          </button>
        </div>
      </div>

      {cargando ? (
        <div style={{display: 'flex', justifyContent: 'center', padding: '50px'}}>
          <Loader2 className="animate-spin" size={40} color="var(--morado)" />
        </div>
      ) : (
        <div className="reportes-lista-vertical">
          {reportesFiltrados.length > 0 ? reportesFiltrados.map(reporte => (
            <div key={reporte.mascotaId} className={`reporte-card-horizontal ${reporte.estado.toLowerCase()}`}>
              <div className="card-image-section">
                {/* Usamos la imagen real o un placeholder si no hay URL */}
                <img src={reporte.fotoUrl || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400'} alt={reporte.nombreMascota} />
              </div>

              <div className="card-info-section">
                <div className="info-top">
                  <div className="title-group">
                    <h2>
                        {reporte.nombreMascota} 
                        <span className={`tag-${reporte.estado.toLowerCase()}`}>
                            {reporte.estado.toUpperCase()}
                        </span>
                    </h2>
                    <p className="raza-text">{reporte.especie} {reporte.raza ? `- ${reporte.raza}` : ''}</p>
                  </div>
                </div>

                <div className="info-meta">
                  <span><MapPin size={16} /> Ubicación registrada</span>
                  <span><Calendar size={16} /> Publicado en el sistema</span>
                </div>

                <div className="alerta-coincidencias">
                  <Zap size={16} fill="currentColor" /> Analizando posibles coincidencias...
                </div>

                <div className="acciones-buttons">
                  <button className="btn-action purple"><Eye size={16} /> Ver Detalles</button>
                  <button className="btn-action gray"><Edit3 size={16} /> Editar</button>
                  <button className="btn-action red-trash" onClick={() => eliminarReporte(reporte.mascotaId)}>
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                <p>No se encontraron reportes con tu cuenta de Auth0.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}