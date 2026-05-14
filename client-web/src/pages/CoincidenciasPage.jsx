import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import { bffApi } from "../components/api";
import { useParams } from 'react-router-dom';

export function CoincidenciasPage() {
  const { idMascota } = useParams(); 
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [coincidencias, setCoincidencias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchCoincidencias = async () => {
      // Si no hay sesión, no hacemos nada
      if (!isAuthenticated) return;

      // EL ARREGLO DE SEGURIDAD: Si no hay ID, apagamos el cargador inmediatamente
      if (!idMascota) {
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        const idNumerico = Number(idMascota);
        console.log(`Consultando coincidencias para mascota ID: ${idNumerico}`);
        
        const data = await bffApi.getCoincidencias(getAccessTokenSilently, idNumerico);
        setCoincidencias(data || []);
      } catch (error) {
        console.error("Error en el Motor de Coincidencias:", error);
      } finally {
        // Garantizamos que el cargador SIEMPRE se apague, con éxito o con error
        setTimeout(() => setCargando(false), 500);
      }
    };

    fetchCoincidencias();
  }, [idMascota, getAccessTokenSilently, isAuthenticated]);

  if (cargando) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={48} color="#7c3aed" />
        <p style={{ marginTop: '15px', color: '#666', fontWeight: '500' }}>
          Analizando match para el reporte #{idMascota || '...' }
        </p>
      </div>
    );
  }

  // Si entran a la página sin un ID en la URL (ej: pinchan el link en el Navbar)
  if (!idMascota) {
    return (
      <div style={{ padding: '80px 20%', textAlign: 'center' }}>
        <AlertCircle size={64} color="#9ca3af" style={{ margin: '0 auto 20px' }} />
        <h2>Selecciona un reporte</h2>
        <p style={{ color: '#666' }}>Debes acceder a esta pantalla desde uno de tus reportes en la sección "Mis Reportes".</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 10%' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles color="#7c3aed" /> Motor de Coincidencias
        </h1>
        <p style={{ color: '#666' }}>
            Resultados para tu reporte <strong>#{idMascota}</strong>.
        </p>
      </div>

      {coincidencias.length > 0 ? (
        coincidencias.map((match) => (
          <div key={match.id} className="coincidencia-card" style={{ marginBottom: '30px', boxShadow: '0 4px 20px rgba(124, 58, 237, 0.15)', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
            <div className="coincidencia-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', background: '#fff', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontWeight: 'bold', color: '#4b5563' }}>
                Match detectado: {new Date(match.fechaCruce).toLocaleDateString()}
              </span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#7c3aed' }}>
                  {match.porcentajeSimilitud}%
                </div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '1px' }}>Similitud</div>
              </div>
            </div>

            <div className="comparativa-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', background: '#f3f4f6' }}>
              <div style={{ padding: '25px', background: '#fff' }}>
                <span style={{ fontSize: '0.65rem', padding: '4px 10px', background: '#f3f4f6', borderRadius: '20px', fontWeight: '600', color: '#6b7280' }}>TU PUBLICACIÓN</span>
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                  <div style={{ width: '100px', height: '100px', background: '#f3f4f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <img src="https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=150" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} alt="Original" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: '#1f2937' }}>ID Reporte: {match.mascotaPerdidaId}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '5px' }}>
                      Estado: <span style={{ color: '#ef4444', fontWeight: '600' }}>PERDIDO</span>
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '25px', background: '#fff' }}>
                <span style={{ fontSize: '0.65rem', padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontWeight: '600' }}>POSIBLE HALLAZGO</span>
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                    <div style={{ width: '100px', height: '100px', background: '#f3f4f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=150" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} alt="Match" />
                    </div>
                  <div>
                    <h4 style={{ margin: 0, color: '#1f2937' }}>ID Reporte: {match.mascotaEncontradaId}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '5px' }}>
                      Estado: <span style={{ color: '#22c55e', fontWeight: '600' }}>ENCONTRADO</span>
                    </p>
                    <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', color: '#7c3aed', marginTop: '8px', cursor: 'pointer', fontWeight: '500' }}>
                      <MapPin size={14}/> Ver zona del encuentro
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '20px', background: '#fff', textAlign: 'center', borderTop: '1px solid #f3f4f6' }}>
               <button 
                className="btn-publicar" 
                style={{ width: '100%', maxWidth: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '10px' }}
               >
                 <CheckCircle size={20} /> Notificar a los involucrados
               </button>
            </div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '25px', border: '2px dashed #e5e7eb' }}>
          <div style={{ background: '#f9fafb', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <AlertCircle size={40} color="#9ca3af" />
          </div>
          <h3 style={{ color: '#374151', fontSize: '1.25rem' }}>No hay coincidencias detectadas</h3>
          <p style={{ color: '#6b7280', maxWidth: '450px', margin: '10px auto 0', lineHeight: '1.5' }}>
            El Motor de Coincidencias está procesando tu reporte <strong>#{idMascota}</strong> mediante Kafka. 
            Vuelve a revisar en unos minutos o espera la notificación de match.
          </p>
        </div>
      )}
    </div>
  );
}