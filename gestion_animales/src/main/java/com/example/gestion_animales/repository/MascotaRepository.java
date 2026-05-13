package com.example.gestion_animales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.gestion_animales.model.Mascota;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Long> {
    List<Mascota> findByEspecieAndEstado(String especie, String estado);
    List<Mascota> findByUsuarioId(String usuarioId);
}