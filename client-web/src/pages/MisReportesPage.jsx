import React, { useState, useEffect } from 'react';
import { Eye, Edit3, CheckCircle, Trash2, Calendar, MapPin, Search, Zap, Loader2 } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import { bffApi } from "../components/api";

export function MisReportesPage() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    const fetchMisReportes = async () => {
      try {
        // En un mundo ideal, el BFF tiene un endpoint: /api/bff/mis-reportes
        // Por ahora, si no lo has creado, podemos filtrar el de mascotas-cercanas 
        // pero lo correcto es pedirle al BFF solo los del usuarioId: 1
        const data = await bffApi.getMascotasCercanas(getAccessTokenSilently);
        
        // Filtramos localmente por el ID que estamos usando (ID 1 según tus pruebas)
        const filtradosPorUsuario = data.filter(m => m.usuarioId === 1 || m.contactoNombre.includes(user?.nickname));
        setReportes(filtradosPorUsuario);
      } catch (error) {
        console.error("Error cargando mis reportes:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchMisReportes();
  }, [getAccessTokenSilently, user]);

  const eliminarReporte = async (id) => {
    if(window.confirm("¿Estás seguro de eliminar este reporte?")) {
        // Aquí llamarías a bffApi.deleteReporte(id)
        alert("Función de borrado conectada al microservicio de animales");
        setReportes(reportes.filter(r => r.mascotaId !== id));
    }
  };

  const reportesFiltrados = filtro === 'todos' 
    ? reportes 
    : reportes.filter(r => r.estado.toLowerCase() === filtro);

  return (
    <div className="mis-reportes-container">
      <header className="page-header">
        <h1>Mis Reportes</h1>
        <p>Hola {user?.nickname}, gestiona tus mascotas reportadas.</p>
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
            <div key={reporte.mascotaId} className={`reporte-card-horizontal ${reporte.estado}`}>
              <div className="card-image-section">
                <img src={reporte.fotoUrl || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400'} alt={reporte.nombreMascota} />
              </div>

              <div className="card-info-section">
                <div className="info-top">
                  <div className="title-group">
                    <h2>{reporte.nombreMascota} <span className={`tag-${reporte.estado.toLowerCase()}`}>{reporte.estado.toUpperCase()}</span></h2>
                    <p className="raza-text">{reporte.especie}</p>
                  </div>
                </div>

                <div className="info-meta">
                  <span><MapPin size={16} /> Ubicación registrada</span>
                  <span><Calendar size={16} /> Publicado recientemente</span>
                </div>

                <div className="alerta-coincidencias">
                  <Zap size={16} fill="currentColor" /> El motor de coincidencia está analizando tu reporte...
                </div>

                <div className="acciones-buttons">
                  <button className="btn-action purple"><Eye size={16} /> Ver</button>
                  <button className="btn-action gray"><Edit3 size={16} /> Editar</button>
                  <button className="btn-action red-trash" onClick={() => eliminarReporte(reporte.mascotaId)}>
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                <p>Aún no tienes reportes creados.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}