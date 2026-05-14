import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import { bffApi } from "../components/api";

export function CoincidenciasPage() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [coincidencias, setCoincidencias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchTodasCoincidencias = async () => {
      if (!isAuthenticated) return;

      try {
        setCargando(true);
        // Llamamos al nuevo método que trae TODO
        const data = await bffApi.getTodasCoincidencias(getAccessTokenSilently);
        setCoincidencias(data || []);
      } catch (error) {
        console.error("Error cargando el feed global:", error);
      } finally {
        setTimeout(() => setCargando(false), 500);
      }
    };

    fetchTodasCoincidencias();
  }, [getAccessTokenSilently, isAuthenticated]);

  if (cargando) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={48} color="#7c3aed" />
        <p style={{ marginTop: '15px', color: '#666', fontWeight: '500' }}>
          Cargando últimos encuentros detectados...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 10%' }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Sparkles color="#7c3aed" /> Muro de Coincidencias
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Nuestro motor inteligente trabajando en tiempo real. Aquí están los últimos matches detectados en la plataforma.
        </p>
      </div>

      {coincidencias.length > 0 ? (
        coincidencias.map((match) => (
          <div key={match.id} className="coincidencia-card" style={{ marginBottom: '30px', boxShadow: '0 4px 20px rgba(124, 58, 237, 0.15)', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
            <div className="coincidencia-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', background: '#fff', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontWeight: 'bold', color: '#4b5563' }}>
                Detección automática: {new Date(match.fechaCruce).toLocaleDateString()}
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
                <span style={{ fontSize: '0.65rem', padding: '4px 10px', background: '#f3f4f6', borderRadius: '20px', fontWeight: '600', color: '#6b7280' }}>REPORTE PERDIDO</span>
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                  <div style={{ width: '100px', height: '100px', background: '#f3f4f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <img src="https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=150" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} alt="Original" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: '#1f2937' }}>ID Mascota: {match.mascotaPerdidaId}</h4>
                  </div>
                </div>
              </div>

              <div style={{ padding: '25px', background: '#fff' }}>
                <span style={{ fontSize: '0.65rem', padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontWeight: '600' }}>REPORTE ENCONTRADO</span>
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                    <div style={{ width: '100px', height: '100px', background: '#f3f4f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=150" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} alt="Match" />
                    </div>
                  <div>
                    <h4 style={{ margin: 0, color: '#1f2937' }}>ID Mascota: {match.mascotaEncontradaId}</h4>
                    <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', color: '#7c3aed', marginTop: '8px', cursor: 'pointer', fontWeight: '500' }}>
                      <MapPin size={14}/> Ver zona
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
                 <CheckCircle size={20} /> Ver detalles de este Match
               </button>
            </div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '25px', border: '2px dashed #e5e7eb' }}>
          <div style={{ background: '#f9fafb', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <AlertCircle size={40} color="#9ca3af" />
          </div>
          <h3 style={{ color: '#374151', fontSize: '1.25rem' }}>No hay coincidencias en la red aún</h3>
          <p style={{ color: '#6b7280', maxWidth: '450px', margin: '10px auto 0', lineHeight: '1.5' }}>
            El motor está esperando nuevos reportes. Apenas se detecte un cruce entre mascotas perdidas y encontradas, aparecerán aquí.
          </p>
        </div>
      )}
    </div>
  );
}