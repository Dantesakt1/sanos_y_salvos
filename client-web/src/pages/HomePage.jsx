import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Loader2 } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import { bffApi } from "../components/api";

export function HomePage() {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        if (isAuthenticated) {
          const data = await bffApi.getMascotasCercanas(getAccessTokenSilently);
          setReportes(data);
        }
      } catch (error) {
        console.error("Error cargando mascotas del BFF:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchReportes();
  }, [getAccessTokenSilently, isAuthenticated]);

  return (
    <div className="home-wrapper">
      <section className="hero-contenedor">
        <div className="hero-info">
          <p className="hero-badge">🐾 PLATAFORMA INTELIGENTE DE MASCOTAS</p>
          <h1 className="hero-titulo">Reuniendo familias con sus mascotas</h1>
          <p className="hero-subtitulo">Tecnología avanzada para encontrar mascotas perdidas más rápido que nunca.</p>
          <div className="hero-botones">
            <Link to="/reportar" className="btn-blanco">
              Reportar mascota perdida <ArrowRight size={20} style={{marginLeft: '10px'}}/>
            </Link>
          </div>
        </div>

        <div className="hero-imagenes-grid">
          <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400" alt="p1" />
          <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400" alt="p2" className="img-offset" />
        </div>
      </section>

      <section className="recientes-wrapper">
        <div className="recientes-header">
          <div>
            <h2 style={{fontSize: '2rem', margin: 0}}>Reportes recientes</h2>
            <p style={{color: '#666', margin: '5px 0'}}>Ayúdalos a volver a casa</p>
          </div>
          <Link to="/mapa" style={{color: 'var(--morado)', fontWeight: 'bold', textDecoration: 'none'}}>Ver en el mapa →</Link>
        </div>

        {cargando ? (
          <div style={{display: 'flex', justifyContent: 'center', padding: '50px'}}>
            <Loader2 className="animate-spin" size={40} color="var(--morado)" />
          </div>
        ) : (
          <div className="reportes-grid">
            {reportes.filter(r => r.estado !== 'identificado').length > 0 ? (
              reportes.filter(r => r.estado !== 'identificado').map(pet => (
                <div key={pet.mascotaId} className="tarjeta-pet">
                  <div style={{ position: 'relative' }}>
                    
                    {/* LA MAGIA DE LA IMAGEN OCURRE AQUÍ */}
                    <img 
                      src={pet.fotoUrl || (pet.especie === 'Gato' 
                        ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' 
                        : 'https://images.unsplash.com/photo-1543466835-00a732f3804c?w=400')} 
                      className="tarjeta-img" 
                      alt={pet.nombreMascota} 
                      onError={(e) => {
                        e.target.onerror = null; // Previene bucles
                        e.target.src = pet.especie === 'Gato' 
                          ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' 
                          : 'https://images.unsplash.com/photo-1543466835-00a732f3804c?w=400';
                      }}
                      style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '15px 15px 0 0' }}
                    />

                    <span className={`etiqueta ${pet.estado}`} style={{ position: 'absolute', top: '15px', left: '15px' }}>
                      {pet.estado.toUpperCase()}
                    </span>
                  </div>
                  <div className="tarjeta-cuerpo">
                    <h3 style={{margin: '0 0 5px 0'}}>{pet.nombreMascota}</h3>
                    <p style={{color: '#888', fontSize: '0.8rem', margin: '0 0 15px 0'}}>{pet.especie}</p>
                    
                    <div style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#666', marginBottom: '5px'}}>
                      <MapPin size={14}/> A {pet.distanciaKm.toFixed(1)} km de ti
                    </div>

                    <p style={{fontSize: '0.75rem', color: '#999', marginBottom: '15px'}}>
                      Contacto: {pet.contactoNombre}
                    </p>

                    <button onClick={() => navigate(`/mascota/${pet.mascotaId}`)} style={{width: '100%', background: 'var(--morado)', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'}}>
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{textAlign: 'center', gridColumn: 'span 3', color: '#666'}}>No hay reportes cercanos en este momento.</p>
            )}
          </div>
        )}
      </section>

      {/* SECCIÓN DE ANIMALES IDENTIFICADOS */}
      {!cargando && reportes.filter(r => r.estado === 'identificado').length > 0 && (
        <section className="recientes-wrapper" style={{ marginTop: '40px' }}>
          <div className="recientes-header">
            <div>
              <h2 style={{fontSize: '2rem', margin: 0, color: '#10B981'}}>Animales Identificados</h2>
              <p style={{color: '#666', margin: '5px 0'}}>Mascotas que ya se han reunido con sus dueños o están a salvo</p>
            </div>
          </div>

          <div className="reportes-grid">
            {reportes.filter(r => r.estado === 'identificado').map(pet => (
              <div key={pet.mascotaId} className="tarjeta-pet" style={{ opacity: 0.9 }}>
                <div style={{ position: 'relative' }}>
                  
                  <img 
                    src={pet.fotoUrl || (pet.especie === 'Gato' 
                      ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' 
                      : 'https://images.unsplash.com/photo-1543466835-00a732f3804c?w=400')} 
                    className="tarjeta-img" 
                    alt={pet.nombreMascota} 
                    onError={(e) => {
                      e.target.onerror = null; // Previene bucles
                      e.target.src = pet.especie === 'Gato' 
                        ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' 
                        : 'https://images.unsplash.com/photo-1543466835-00a732f3804c?w=400';
                    }}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '15px 15px 0 0' }}
                  />

                  <span className={`etiqueta ${pet.estado}`} style={{ position: 'absolute', top: '15px', left: '15px', background: '#10B981', color: 'white' }}>
                    {pet.estado.toUpperCase()}
                  </span>
                </div>
                <div className="tarjeta-cuerpo">
                  <h3 style={{margin: '0 0 5px 0'}}>{pet.nombreMascota}</h3>
                  <p style={{color: '#888', fontSize: '0.8rem', margin: '0 0 15px 0'}}>{pet.especie}</p>
                  
                  <div style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#666', marginBottom: '5px'}}>
                    <MapPin size={14}/> A {pet.distanciaKm.toFixed(1)} km de ti
                  </div>

                  <p style={{fontSize: '0.75rem', color: '#999', marginBottom: '15px'}}>
                    Contacto: {pet.contactoNombre}
                  </p>

                  <button onClick={() => navigate(`/mascota/${pet.mascotaId}`)} style={{width: '100%', background: 'var(--morado)', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}