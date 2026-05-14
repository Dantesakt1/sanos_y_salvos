const BASE_URL = 'http://localhost:8085/api/bff';

export const bffApi = {
  /**
   * Obtener mascotas cercanas para el Inicio o Mapa
   * Orquesta datos de Animales, Usuarios y Geolocalización
   */
  getMascotasCercanas: async (getToken, lat = -33.45, lon = -70.66) => {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/mascotas-cercanas?lat=${lat}&lon=${lon}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener mascotas cercanas');
    }
    return response.json();
  },

  /**
   * Enviar un nuevo reporte desde ReportarPage
   * El usuarioId ahora viaja como String (Auth0 sub)
   */
  postReporte: async (getToken, datosMascota) => {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/reportar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(datosMascota),
    });

    if (!response.ok) {
      throw new Error('Error al crear el reporte en el servidor');
    }
    return response.json();
  },

  /**
   * Obtener los reportes específicos del usuario autenticado
   * Filtra por el String de Auth0 (ej: auth0|69c51...)
   */
  getMisReportes: async (getToken, usuarioId) => {
    const token = await getToken();
    
    // Corregida la URL para evitar duplicidad de /api/bff
    const response = await fetch(`${BASE_URL}/mis-reportes/${usuarioId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener tus reportes personales');
    }
    return response.json();
  },

    getCoincidencias: async (getToken, mascotaId) => {
    const token = await getToken();
    // Verifica que NO diga /api/bff/api/bff
    const response = await fetch(`${BASE_URL}/coincidencias/mascota/${mascotaId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error en el motor');
    return response.json();
  }
};