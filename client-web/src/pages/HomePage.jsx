import React from 'react';
import { Link } from 'react-router-dom';

export function HomePage() {
  const recientes = [
    { id: 1, nombre: 'Max', tipo: 'perdida', raza: 'Golden Retriever', img: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400' },
    { id: 2, nombre: 'Luna', tipo: 'encontrada', raza: 'Siamés', img: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400' }
  ];

  return (
    <div>
      {/* Sección Hero - Foto 092715 */}
      <section className="hero-contenedor">
        <div>
          <p style={{fontSize: '0.8rem', fontWeight: 'bold'}}>🐾 Plataforma Inteligente de Mascotas</p>
          <h1 className="hero-titulo">Reuniendo familias con sus mascotas</h1>
          <p className="hero-subtitulo">Tecnología avanzada que conecta dueños y comunidad para encontrar mascotas perdidas.</p>
          <div className="hero-botones">
            <Link to="/reportar" className="btn-blanco">Reportar Mascota Perdida →</Link>
            <Link to="/reportar" className="btn-transparente">Encontré una Mascota ♡</Link>
          </div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
           <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300" style={{borderRadius: '20px'}} />
           <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300" style={{borderRadius: '20px', marginTop: '20px'}} />
        </div>
      </section>

      {/* Sección Reportes - Foto 092735 */}
      <h2 style={{textAlign: 'center', marginTop: '40px'}}>Reportes Recientes</h2>
      <div className="reportes-grid">
        {recientes.map(pet => (
          <div key={pet.id} className="tarjeta-pet">
            <img src={pet.img} className="tarjeta-img" alt={pet.nombre} />
            <div className="tarjeta-cuerpo">
              <span className={`etiqueta ${pet.tipo}`}>{pet.tipo.toUpperCase()}</span>
              <h3 style={{margin: '5px 0'}}>{pet.nombre}</h3>
              <p style={{color: '#666', fontSize: '0.9rem'}}>{pet.raza}</p>
              <button style={{width: '100%', padding: '10px', background: 'var(--morado-principal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px'}}>Ver Detalles</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}