package com.example.BFF.DTO;

import lombok.Data;

@Data
public class MascotaDto {
    private Long id;
    private String nombre;
    private String especie;
    private String raza;
    private String estado;
    private Double latitud;
    private Double longitud;
    private String descripcion;
    private Long usuarioId;
    private String fotoUrl;
    
}
