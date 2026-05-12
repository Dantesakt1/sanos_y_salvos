import React, { useState } from 'react';
import { Camera, MapPin, Send } from 'lucide-react';

export function ReportarPage() {
  const [tipo, setTipo] = useState('perdida');

  return (
    <div className="formulario-contenedor">
      <h1 style={{fontSize: '2rem', marginBottom: '10px'}}>Reportar Mascota</h1>
      <p style={{color: '#666', marginBottom: '30px'}}>Completa los detalles para ayudarnos a encontrarla.</p>

      <div className="selector-tipo-reporte">
        <div 
          className={`opcion-tipo ${tipo === 'perdida' ? 'seleccionada-rojo' : ''}`}
          onClick={() => setTipo('perdida')}
        >
          🔴 Mascota Perdida
        </div>
        <div 
          className={`opcion-tipo ${tipo === 'encontrada' ? 'seleccionada-verde' : ''}`}
          onClick={() => setTipo('encontrada')}
        >
          🟢 Mascota Encontrada
        </div>
      </div>

      <form className="grid-form" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
        <div className="grupo-input">
          <label>Nombre de la Mascota</label>
          <input type="text" className="input-texto" placeholder="Ej: Max" />
        </div>
        <div className="grupo-input">
          <label>Especie *</label>
          <select className="input-select">
            <option>Selecciona...</option>
            <option>Perro</option>
            <option>Gato</option>
          </select>
        </div>
        
        <div className="grupo-input" style={{gridColumn: 'span 2'}}>
          <label>Descripción y Características *</label>
          <textarea className="input-area" rows="4" placeholder="Cualquier marca especial, collar, etc."></textarea>
        </div>

        <div className="grupo-input" style={{gridColumn: 'span 2', textAlign: 'center', padding: '40px', border: '2px dashed #ccc', borderRadius: '15px'}}>
          <Camera size={40} color="#999" />
          <p>Haz clic para subir una foto</p>
        </div>

        <button type="button" className="btn-blanco" style={{gridColumn: 'span 2', background: 'var(--morado-principal)', color: 'white', fontSize: '1.2rem'}}>
          Publicar Reporte
        </button>
      </form>
    </div>
  );
}