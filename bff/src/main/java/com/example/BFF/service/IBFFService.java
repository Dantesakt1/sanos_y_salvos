package com.example.BFF.service;

import java.util.List;
import com.example.BFF.DTO.MascotaDto;
import com.example.BFF.DTO.ReporteDetalladoDto;

public interface IBFFService {
    // Método para obtener mascotas con distancia
    List<ReporteDetalladoDto> obtenerMascotaConDistancia(double latUser, double lonUser);

    // Método para registrar una mascota (reporte)
    MascotaDto registrarReporteCompleto(MascotaDto mascota);

    List<MascotaDto> obtenerMisReportes(String usuarioId);

    ReporteDetalladoDto obtenerMascotaPorId(Long id);

    MascotaDto actualizarEstadoMascota(Long id, String estado);
}
