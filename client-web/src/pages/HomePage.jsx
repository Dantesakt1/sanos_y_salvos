import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock } from 'lucide-react';

export function HomePage() {
  const recientes = [
    { id: 1, nombre: 'Max', tipo: 'perdida', raza: 'Golden Retriever', ubicacion: 'Las Condes, Santiago', tiempo: '2 horas', img: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400' },
    { id: 2, nombre: 'Desconocido', tipo: 'encontrada', raza: 'Siamés', ubicacion: 'Providencia, Santiago', tiempo: '5 horas', img: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400' },
    { id: 3, nombre: 'Luna', tipo: 'perdida', raza: 'Persa', ubicacion: 'Vitacura, Santiago', tiempo: '1 día', img: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400' },
    { id: 4, nombre: 'Rocky', tipo: 'encontrada', raza: 'Pastor Alemán', ubicacion: 'Ñuñoa, Santiago', tiempo: '3 horas', img: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400' }
  ];

  return (
    <div className="home-wrapper">
      {/* BLOQUE MORADO */}
      <section className="hero-contenedor">
        <div className="hero-info">
          <p className="hero-badge">🐾 PLATAFORMA INTELIGENTE DE MASCOTAS</p>
          <h1 className="hero-titulo">Reuniendo familias con sus mascotas</h1>
          <p className="hero-subtitulo">Tecnología avanzada para encontrar mascotas perdidas más rápido que nunca.</p>
          <div className="hero-botones">
            <Link to="/reportar" className="btn-blanco">
              Reportar Mascota Perdida <ArrowRight size={20} style={{marginLeft: '10px'}}/>
            </Link>
            <Link to="/reportar" className="btn-transparente">Encontré una Mascota ♡</Link>
          </div>
        </div>

        <div className="hero-imagenes-grid">
          <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400" alt="p1" />
          <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400" alt="p2" className="img-offset" />
        </div>
      </section>

      {/* SECCIÓN REPORTES */}
      <section className="recientes-wrapper">
        <div className="recientes-header">
          <div>
            <h2 style={{fontSize: '2rem', margin: 0}}>Reportes Recientes</h2>
            <p style={{color: '#666', margin: '5px 0'}}>Ayúdalos a volver a casa</p>
          </div>
          <Link to="/mapa" style={{color: 'var(--morado)', fontWeight: 'bold', textDecoration: 'none'}}>Ver en el Mapa →</Link>
        </div>

        <div className="reportes-grid">
          {recientes.map(pet => (
            <div key={pet.id} className="tarjeta-pet">
              <div style={{ position: 'relative' }}>
                <img src={pet.img} className="tarjeta-img" alt={pet.nombre} />
                <span className={`etiqueta ${pet.tipo}`} style={{ position: 'absolute', top: '15px', left: '15px' }}>
                  {pet.tipo}
                </span>
              </div>
              <div className="tarjeta-cuerpo">
                <h3 style={{margin: '0 0 5px 0'}}>{pet.nombre}</h3>
                <p style={{color: '#888', fontSize: '0.8rem', margin: '0 0 15px 0'}}>{pet.raza}</p>
                <div style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#666', marginBottom: '15px'}}>
                  <MapPin size={14}/> {pet.ubicacion}
                </div>
                <button style={{width: '100%', background: 'var(--morado)', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'}}>
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}