const BASE_URL = 'http://localhost:8085/api/bff';

export const bffApi = {
  // Obtener mascotas cercanas para el Inicio o Mapa
  getMascotasCercanas: async (getToken, lat = -33.45, lon = -70.66) => {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/mascotas-cercanas?lat=${lat}&lon=${lon}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Error al obtener mascotas');
    return response.json();
  },

  // Enviar el nuevo reporte desde ReportarPage
  postReporte: async (getToken, datosMascota) => {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/reportar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datosMascota),
    });
    if (!response.ok) throw new Error('Error al crear reporte');
    return response.json();
  }
};