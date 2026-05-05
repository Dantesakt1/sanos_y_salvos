import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

const Formulario = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [mascota, setMascota] = useState({
    nombre: '', especie: '', raza: '', estado: 'PERDIDO',
    latitud: '', longitud: '', descripcion: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      await axios.post('http://localhost:8081/api/mascotas', mascota, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

      alert("¡Mascota reportada con éxito! El motor de coincidencias está analizando...");
      setMascota({ nombre: '', especie: '', raza: '', estado: 'PERDIDO', latitud: '', longitud: '', descripcion: '' });
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="container">
      <h2>Reportar Mascota</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre" value={mascota.nombre} onChange={(e)=>setMascota({...mascota, nombre: e.target.value})} required />
        <input type="text" placeholder="Especie" value={mascota.especie} onChange={(e)=>setMascota({...mascota, especie: e.target.value})} required />
        <select value={mascota.estado} onChange={(e)=>setMascota({...mascota, estado: e.target.value})}>
          <option value="PERDIDO">Perdido</option>
          <option value="ENCONTRADO">Encontrado</option>
        </select>
        <input type="number" step="any" placeholder="Latitud" value={mascota.latitud} onChange={(e)=>setMascota({...mascota, latitud: e.target.value})} required />
        <input type="number" step="any" placeholder="Longitud" value={mascota.longitud} onChange={(e)=>setMascota({...mascota, longitud: e.target.value})} required />
        <textarea placeholder="Descripción" value={mascota.descripcion} onChange={(e)=>setMascota({...mascota, descripcion: e.target.value})} required />
        <button type="submit">Enviar Reporte</button>
      </form>
    </div>
  );
};

export default Formulario;