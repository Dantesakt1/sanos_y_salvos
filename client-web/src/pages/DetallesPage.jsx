import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { bffApi } from "../components/api";
import { Loader2, MapPin, Phone, Info, ArrowLeft, CheckCircle } from 'lucide-react';

export function DetallesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const [mascota, setMascota] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  useEffect(() => {
    const fetchMascota = async () => {
      try {
        const data = await bffApi.getMascotaById(getAccessTokenSilently, id);
        setMascota(data);
      } catch (error) {
        console.error("Error al cargar la mascota:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchMascota();
  }, [id, getAccessTokenSilently]);

  const handleMarcarIdentificado = async () => {
    if (!window.confirm('¿Estás seguro de que deseas marcar a este animal como identificado?')) return;
    
    setActualizando(true);
    try {
      await bffApi.actualizarEstadoMascota(getAccessTokenSilently, id, 'identificado');
      alert('¡Estado actualizado exitosamente!');
      navigate('/');
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Hubo un error al actualizar el estado.');
    } finally {
      setActualizando(false);
    }
  };

  if (cargando) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh'}}>
        <Loader2 className="animate-spin" size={60} color="var(--morado)" />
      </div>
    );
  }

  if (!mascota) {
    return (
      <div style={{textAlign: 'center', marginTop: '50px'}}>
        <h2>Mascota no encontrada</h2>
        <button onClick={() => navigate('/')} className="btn-primario" style={{marginTop: '20px'}}>Volver al inicio</button>
      </div>
    );
  }

  const defaultImg = mascota.especie === 'Gato' 
    ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800' 
    : 'https://images.unsplash.com/photo-1543466835-00a732f3804c?w=800';

  return (
    <div className="detalle-wrapper" style={{maxWidth: '800px', margin: '0 auto', padding: '40px 20px'}}>
      <button 
        onClick={() => navigate(-1)} 
        style={{background: 'none', border: 'none', color: 'var(--morado)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', fontWeight: 'bold'}}
      >
        <ArrowLeft size={20} /> Volver
      </button>

      <div style={{background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
        <div style={{position: 'relative', height: '400px'}}>
          <img 
            src={mascota.fotoUrl || defaultImg} 
            alt={mascota.nombreMascota}
            onError={(e) => { e.target.onerror = null; e.target.src = defaultImg; }}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
          <span className={`etiqueta ${mascota.estado}`} style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '1rem', padding: '8px 15px' }}>
            {mascota.estado.toUpperCase()}
          </span>
        </div>

        <div style={{padding: '30px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
            <div>
              <h1 style={{margin: '0 0 5px 0', fontSize: '2.5rem', color: '#333'}}>{mascota.nombreMascota}</h1>
              <p style={{color: '#666', fontSize: '1.2rem', margin: 0}}>{mascota.especie}</p>
            </div>
            
            {mascota.estado !== 'identificado' && (
              <button 
                onClick={handleMarcarIdentificado}
                disabled={actualizando}
                className="btn-primario"
                style={{display: 'flex', alignItems: 'center', gap: '8px', background: '#10B981'}} // Verde
              >
                {actualizando ? <Loader2 className="animate-spin" size={20}/> : <CheckCircle size={20} />}
                {actualizando ? 'Actualizando...' : 'Marcar como Identificado'}
              </button>
            )}
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px'}}>
            <div style={{display: 'flex', alignItems: 'flex-start', gap: '10px'}}>
              <Info size={24} color="var(--morado)" />
              <div>
                <strong style={{display: 'block', color: '#333'}}>Descripción</strong>
                <p style={{margin: '5px 0', color: '#666'}}>{mascota.descripcion || 'Sin descripción.'}</p>
              </div>
            </div>
            
            <div style={{display: 'flex', alignItems: 'flex-start', gap: '10px', gridColumn: 'span 2'}}>
              <MapPin size={24} color="var(--morado)" />
              <div style={{width: '100%'}}>
                <strong style={{display: 'block', color: '#333'}}>Ubicación</strong>
                <p style={{margin: '5px 0', color: '#666'}}>
                  Lat: {mascota.latitud != null ? mascota.latitud.toFixed(4) : 'N/A'}, 
                  Lng: {mascota.longitud != null ? mascota.longitud.toFixed(4) : 'N/A'}
                </p>
                {mascota.latitud != null && mascota.longitud != null && (
                  <div style={{marginTop: '15px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #eee'}}>
                    <iframe
                      title="Mapa de ubicación"
                      width="100%"
                      height="250"
                      frameBorder="0"
                      style={{border: 0}}
                      src={`https://maps.google.com/maps?q=${mascota.latitud},${mascota.longitud}&hl=es&z=15&output=embed`}
                      allowFullScreen
                    ></iframe>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${mascota.latitud},${mascota.longitud}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{display: 'block', padding: '12px', background: '#f8f9fa', textAlign: 'center', color: 'var(--morado)', textDecoration: 'none', fontWeight: 'bold', borderTop: '1px solid #eee'}}
                    >
                      Abrir en Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div style={{display: 'flex', alignItems: 'flex-start', gap: '10px'}}>
              <Phone size={24} color="var(--morado)" />
              <div>
                <strong style={{display: 'block', color: '#333'}}>Contacto</strong>
                <p style={{margin: '5px 0', color: '#666'}}>{mascota.contactoNombre}</p>
                <p style={{margin: '0', color: '#666'}}>{mascota.contactoTelefono}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
