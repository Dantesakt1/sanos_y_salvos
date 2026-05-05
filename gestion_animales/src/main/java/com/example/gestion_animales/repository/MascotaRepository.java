package com.example.gestion_animales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.gestion_animales.model.Mascota;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Long> {
    
}