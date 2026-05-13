package com.example.BFF.DTO; 

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CoincidenciaDto {
    private Long id;
    private Long mascotaPerdidaId;
    private Long mascotaEncontradaId;
    private Double porcentajeSimilitud;
    private LocalDateTime fechaCruce;
    
    // Opcional: Puedes agregar estos campos si quieres que el BFF 
    // ya entregue los nombres de las mascotas al frontend
    private String nombreMascotaPerdida;
    private String nombreMascotaEncontrada;
}