package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "coincidencia")
public class Coincidencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long mascotaPerdidaId;
    private Long mascotaEncontradaId;
    private Double porcentajeSimilitud;
    private LocalDateTime fechaCruce;
}