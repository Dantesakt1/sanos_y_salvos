import React from 'react';
import { Sparkles, MapPin, CheckCircle } from 'lucide-react';

export function CoincidenciasPage() {
  return (
    <div style={{padding: '40px 10%'}}>
      <div style={{marginBottom: '30px'}}>
        <h1 style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <Sparkles color="#7c3aed" /> Motor de Coincidencias
        </h1>
        <p style={{color: '#666'}}>Nuestro algoritmo inteligente ha detectado posibles encuentros.</p>
      </div>

      {/* Tarjeta de Coincidencia */}
      <div className="coincidencia-card">
        <div className="coincidencia-header">
          <span style={{fontWeight: 'bold'}}>Coincidencia #1 - Detectada hoy</span>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>95%</div>
            <div style={{fontSize: '0.7rem'}}>Probabilidad</div>
          </div>
        </div>

        <div className="comparativa-grid">
          {/* Lado Perdida */}
          <div className="lado-perdida">
            <span className="etiqueta perdida">PERDIDA</span>
            <div style={{display: 'flex', gap: '15px', marginTop: '10px'}}>
              <img src="https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=150" style={{borderRadius: '10px', width: '100px', height: '100px', objectFit: 'cover'}} alt="p" />
              <div>
                <h4 style={{margin: 0}}>Max</h4>
                <p style={{fontSize: '0.8rem', color: '#444'}}>Raza: Golden Retriever<br/>Color: Dorado</p>
                <div style={{fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px'}}>
                  <MapPin size={12}/> Las Condes
                </div>
              </div>
            </div>
          </div>

          {/* Lado Encontrada */}
          <div className="lado-encontrada">
            <span className="etiqueta encontrada">ENCONTRADA</span>
            <div style={{display: 'flex', gap: '15px', marginTop: '10px'}}>
              <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=150" style={{borderRadius: '10px', width: '100px', height: '100px', objectFit: 'cover'}} alt="e" />
              <div>
                <h4 style={{margin: 0}}>Mascota Encontrada</h4>
                <p style={{fontSize: '0.8rem', color: '#444'}}>Color: Dorado claro<br/>Tamaño: Grande</p>
                <div style={{fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px'}}>
                  <MapPin size={12}/> Providencia
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{padding: '20px', background: 'white', textAlign: 'center', borderTop: '1px solid #eee'}}>
           <button className="btn-blanco" style={{background: 'var(--morado-principal)', color: 'white', width: '300px'}}>Confirmar Coincidencia</button>
        </div>
      </div>
    </div>
  );
}