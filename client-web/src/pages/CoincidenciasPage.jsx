import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import { bffApi } from "../components/api";
import { useParams } from 'react-router-dom';

export function CoincidenciasPage() {
  const { idMascota } = useParams(); // Recibimos el ID de la mascota desde la URL
  const { getAccessTokenSilently } = useAuth0();
  const [coincidencias, setCoincidencias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchCoincidencias = async () => {
      try {
        setCargando(true);
        // Llamada al BFF que consulta al microservicio Motor de Coincidencias
        const data = await bffApi.getCoincidencias(getAccessTokenSilently, idMascota);
        setCoincidencias(data);
      } catch (error) {
        console.error("Error al obtener coincidencias del motor:", error);
      } finally {
        setCargando(false);
      }
    };

    if (idMascota) fetchCoincidencias();
  }, [idMascota, getAccessTokenSilently]);

  if (cargando) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={48} color="#7c3aed" />
        <p style={{ marginTop: '15px', color: '#666' }}>El motor está analizando las bases de datos...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 10%' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles color="#7c3aed" /> Motor de Coincidencias
        </h1>
        <p style={{ color: '#666' }}>Detecciones inteligentes basadas en especie, ubicación y tiempo.</p>
      </div>

      {coincidencias.length > 0 ? (
        coincidencias.map((match) => (
          <div key={match.id} className="coincidencia-card" style={{ marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '15px', overflow: 'hidden' }}>
            <div className="coincidencia-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', background: '#fff' }}>
              <span style={{ fontWeight: 'bold', color: '#4b5563' }}>
                Coincidencia detectada el {new Date(match.fechaCruce).toLocaleDateString()}
              </span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#7c3aed' }}>
                  {match.porcentajeSimilitud}%
                </div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#9ca3af' }}>Probabilidad</div>
              </div>
            </div>

            <div className="comparativa-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', background: '#f3f4f6' }}>
              {/* LADO TU REPORTE (Basado en MascotaPerdidaId o MascotaEncontradaId según el caso) */}
              <div style={{ padding: '20px', background: '#fff' }}>
                <span className="etiqueta perdida" style={{ fontSize: '0.65rem', padding: '4px 10px' }}>TU PUBLICACIÓN</span>
                <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=150" 
                    style={{ borderRadius: '12px', width: '90px', height: '90px', objectFit: 'cover' }} 
                    alt="Tu mascota" 
                  />
                  <div>
                    <h4 style={{ margin: 0 }}>Reporte #{match.mascotaPerdidaId}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: '1.4' }}>
                      Estado: Perdido<br/>
                      Analizado por Motor
                    </p>
                  </div>
                </div>
              </div>

              {/* LADO POSIBLE ENCUENTRO */}
              <div style={{ padding: '20px', background: '#fff' }}>
                <span className="etiqueta encontrada" style={{ fontSize: '0.65rem', padding: '4px 10px' }}>POSIBLE MATCH</span>
                <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=150" 
                    style={{ borderRadius: '12px', width: '90px', height: '90px', objectFit: 'cover' }} 
                    alt="Mascota encontrada" 
                  />
                  <div>
                    <h4 style={{ margin: 0 }}>Reporte #{match.mascotaEncontradaId}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: '1.4' }}>
                      Estado: Encontrado<br/>
                      Detectado a menos de 5km
                    </p>
                    <div style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#7c3aed', marginTop: '5px' }}>
                      <MapPin size={12}/> Ver en Mapa
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '20px', background: '#f9fafb', textAlign: 'center', borderTop: '1px solid #eee' }}>
               <button 
                className="btn-publicar" 
                style={{ width: '100%', maxWidth: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
               >
                 <CheckCircle size={18} /> Confirmar y Contactar Dueño
               </button>
            </div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '20px', border: '2px dashed #e5e7eb' }}>
          <AlertCircle size={48} color="#9ca3af" style={{ marginBottom: '15px' }} />
          <h3 style={{ color: '#4b5563' }}>Sin coincidencias aún</h3>
          <p style={{ color: '#9ca3af', maxWidth: '400px', margin: '0 auto' }}>
            El motor de Kafka sigue analizando nuevos reportes en tiempo real. Te avisaremos si detectamos un match para el ID {idMascota}.
          </p>
        </div>
      )}
    </div>
  );
}