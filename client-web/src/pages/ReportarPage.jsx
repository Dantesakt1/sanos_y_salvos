import React, { useState, useRef } from 'react';
import { Camera, MapPin, Loader2, X } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import { bffApi } from "../components/api";
import { useNavigate } from 'react-router-dom';

export function ReportarPage() {
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [enviando, setEnviando] = useState(false);
  const [preview, setPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    estado: 'perdida',
    descripcion: '',
    latitud: null,
    longitud: null,
    fotoUrl: '', // <--- Nuevo atributo sincronizado
    usuarioId: 1 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const urlTemporal = URL.createObjectURL(file);
      setPreview(urlTemporal);
      // Guardamos la URL temporal en el campo fotoUrl para el backend
      setFormData(prev => ({ ...prev, fotoUrl: urlTemporal }));
    }
  };

  const obtenerUbicacion = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setFormData(prev => ({
        ...prev,
        latitud: pos.coords.latitude,
        longitud: pos.coords.longitude
      }));
      alert("Ubicación capturada correctamente");
    }, (error) => {
      alert("Error al obtener ubicación. Por favor, activa el GPS.");
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Convertimos explícitamente a los tipos que espera Java
  const mascotaParaEnviar = {
    ...formData,
    latitud: parseFloat(formData.latitud),
    longitud: parseFloat(formData.longitud),
    usuarioId: parseInt(formData.usuarioId) // Forzamos que sea un número
  };

  setEnviando(true);
  try {
    const resultado = await bffApi.postReporte(getAccessTokenSilently, mascotaParaEnviar);
    alert("¡Mascota reportada con éxito!");
    navigate('/');
  } catch (error) {
    console.error("Error al publicar:", error);
    alert("Error 500: Revisa la terminal del BFF para ver el error de Java");
  } finally {
    setEnviando(false);
  }
};

  return (
    <div className="formulario-contenedor">
      <h1 className="titulo-form">Reportar Mascota</h1>
      <p className="subtitulo-form">Completa los detalles para ayudarnos a encontrarla.</p>

      <div className="selector-tipo-reporte">
        <div 
          className={`opcion-tipo ${formData.estado === 'perdida' ? 'seleccionada-rojo' : ''}`}
          onClick={() => setFormData(prev => ({...prev, estado: 'perdida'}))}
        >
          🔴 Mascota Perdida
        </div>
        <div 
          className={`opcion-tipo ${formData.estado === 'encontrada' ? 'seleccionada-verde' : ''}`}
          onClick={() => setFormData(prev => ({...prev, estado: 'encontrada'}))}
        >
          🟢 Mascota Encontrada
        </div>
      </div>

      <form className="grid-form" onSubmit={handleSubmit} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
        <div className="grupo-input">
          <label>Nombre de la Mascota</label>
          <input name="nombre" type="text" className="input-texto" placeholder="Ej: Max" value={formData.nombre} onChange={handleChange} required />
        </div>

        <div className="grupo-input">
          <label>Especie *</label>
          <select name="especie" className="input-select" onChange={handleChange} value={formData.especie} required>
            <option value="">Selecciona...</option>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div className="grupo-input" style={{gridColumn: 'span 2'}}>
          <label>Raza</label>
          <input name="raza" type="text" className="input-texto" placeholder="Ej: Golden Retriever" value={formData.raza} onChange={handleChange} />
        </div>
        
        <div className="grupo-input" style={{gridColumn: 'span 2'}}>
          <label>Descripción y Características *</label>
          <textarea name="descripcion" className="input-area" rows="4" placeholder="Marcas, collar, etc." value={formData.descripcion} onChange={handleChange} required></textarea>
        </div>

        <div className="grupo-input" style={{gridColumn: 'span 2'}}>
          <button type="button" onClick={obtenerUbicacion} className={`btn-action ${formData.latitud ? 'green' : 'gray'}`} style={{width: '100%', justifyContent: 'center'}}>
            <MapPin size={18} /> {formData.latitud ? 'Ubicación Capturada ✓' : 'Capturar Ubicación Actual'}
          </button>
        </div>

        {/* ÁREA DE FOTO ACTUALIZADA */}
        <div className="grupo-input" style={{gridColumn: 'span 2'}}>
          <label>Foto de la Mascota</label>
          <div 
            className="area-foto-upload" 
            onClick={() => fileInputRef.current.click()}
            style={{ cursor: 'pointer', position: 'relative', minHeight: '150px', border: '2px dashed #ccc', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            
            {preview ? (
              <>
                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); setPreview(null); setFormData(p => ({...p, fotoUrl: ''})) }}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', padding: '5px', color: 'white' }}
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <Camera size={40} color="#999" />
                <p style={{ color: '#999', marginTop: '10px' }}>Haz clic para subir una foto</p>
              </>
            )}
          </div>
        </div>

        <button type="submit" className="btn-publicar" disabled={enviando} style={{opacity: enviando ? 0.7 : 1, gridColumn: 'span 2'}}>
          {enviando ? <><Loader2 className="animate-spin" size={20} /> Publicando...</> : 'Publicar Reporte'}
        </button>
      </form>
    </div>
  );
}