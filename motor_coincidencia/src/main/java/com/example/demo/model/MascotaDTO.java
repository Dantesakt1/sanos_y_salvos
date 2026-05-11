package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MascotaDTO {

    private Long id;
    private String nombre;
    private String especie;
    private String raza;
    private String estado;
    private Double latitud;
    private Double longitud;
    private String descripcion;
    private Long usuarioId;
}