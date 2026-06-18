package com.example.gestion_animales.repository;

import com.example.gestion_animales.model.Mascota;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class MascotaRepositoryTest {

    @Autowired
    private MascotaRepository mascotaRepository;

    @Test
    void debeEncontrarPorEspecieYEstado() {
        // Preparar
        Mascota m = new Mascota(null, "Rex", "Perro", "Pastor", "Perdido", 0.0, 0.0, "Jugueton", "user1", "url");
        mascotaRepository.save(m);

        // Ejecutar
        List<Mascota> resultado = mascotaRepository.findByEspecieAndEstado("Perro", "Perdido");

        // Validar
        assertFalse(resultado.isEmpty());
        assertEquals("Rex", resultado.get(0).getNombre());
    }

    @Test
    void debeEncontrarPorUsuarioId() {
        // Preparar
        Mascota m = new Mascota(null, "Pelusa", "Gato", "Mestizo", "Encontrado", 0.0, 0.0, "Tranquila", "admin", "url");
        mascotaRepository.save(m);

        // Ejecutar
        List<Mascota> resultado = mascotaRepository.findByUsuarioId("admin");

        // Validar
        assertFalse(resultado.isEmpty());
        assertEquals("admin", resultado.get(0).getUsuarioId());
    }
}