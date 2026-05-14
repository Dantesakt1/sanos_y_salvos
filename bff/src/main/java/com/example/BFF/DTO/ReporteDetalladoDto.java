package com.example.BFF.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReporteDetalladoDto {
    private Long mascotaId;
    private String nombreMascota;
    private String especie;
    private String estado;
    private String descripcion;
    private Double latitud;
    private Double longitud;


    private String contactoNombre;
    private String contactoTelefono;


    private Double distanciaKm;

    private String fotoUrl;
}
