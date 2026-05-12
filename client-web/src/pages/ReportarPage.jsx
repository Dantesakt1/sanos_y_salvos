import React, { useState } from 'react';
import { Camera, MapPin } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react"; // Para el usuarioId

export function ReportarPage() {
  const { user } = useAuth0();
  
  // Estado inicial siguiendo el modelo Mascota.java
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    estado: 'perdida', // 'perdida' o 'encontrada'
    descripcion: '',
    latitud: null,
    longitud: null,
    usuarioId: user?.sub || '' // Usamos el ID de Auth0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTipoChange = (nuevoEstado) => {
    setFormData(prev => ({ ...prev, estado: nuevoEstado }));
  };

  // Función para obtener ubicación (opcional, pero útil para lat/lng)
  const obtenerUbicacion = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setFormData(prev => ({
        ...prev,
        latitud: pos.coords.latitude,
        longitud: pos.coords.longitude
      }));
      alert("Ubicación capturada correctamente");
    });
  };

  return (
    <div className="formulario-contenedor">
      <h1 className="titulo-form">Reportar Mascota</h1>
      <p className="subtitulo-form">Completa los detalles para ayudarnos a encontrarla.</p>

      {/* Selector de Estado (Mapeado a private String estado) */}
      <div className="selector-tipo-reporte">
        <div 
          className={`opcion-tipo ${formData.estado === 'perdida' ? 'seleccionada-rojo' : ''}`}
          onClick={() => handleTipoChange('perdida')}
        >
          🔴 Mascota Perdida
        </div>
        <div 
          className={`opcion-tipo ${formData.estado === 'encontrada' ? 'seleccionada-verde' : ''}`}
          onClick={() => handleTipoChange('encontrada')}
        >
          🟢 Mascota Encontrada
        </div>
      </div>

      <form className="grid-form" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
        {/* Nombre */}
        <div className="grupo-input">
          <label>Nombre de la Mascota</label>
          <input 
            name="nombre"
            type="text" 
            className="input-texto" 
            placeholder="Ej: Max" 
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>

        {/* Especie */}
        <div className="grupo-input">
          <label>Especie *</label>
          <select name="especie" className="input-select" onChange={handleChange} value={formData.especie}>
            <option value="">Selecciona...</option>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Raza (Nuevo atributo según Mascota.java) */}
        <div className="grupo-input" style={{gridColumn: 'span 2'}}>
          <label>Raza</label>
          <input 
            name="raza"
            type="text" 
            className="input-texto" 
            placeholder="Ej: Golden Retriever o Mestizo" 
            value={formData.raza}
            onChange={handleChange}
          />
        </div>
        
        {/* Descripción */}
        <div className="grupo-input" style={{gridColumn: 'span 2'}}>
          <label>Descripción y Características *</label>
          <textarea 
            name="descripcion"
            className="input-area" 
            rows="4" 
            placeholder="Cualquier marca especial, collar, etc."
            value={formData.descripcion}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Ubicación (Para latitud y longitud) */}
        <div className="grupo-input" style={{gridColumn: 'span 2'}}>
          <button 
            type="button" 
            onClick={obtenerUbicacion}
            className="btn-action gray" 
            style={{width: '100%', justifyContent: 'center'}}
          >
            <MapPin size={18} /> {formData.latitud ? 'Ubicación Capturada' : 'Capturar Ubicación Actual'}
          </button>
        </div>

        {/* Foto */}
        <div className="area-foto-upload">
          <Camera size={40} color="#999" />
          <p>Haz clic para subir una foto</p>
        </div>

        <button type="button" className="btn-publicar">
          Publicar Reporte
        </button>
      </form>
    </div>
  );
}