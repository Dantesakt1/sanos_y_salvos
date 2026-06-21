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
        // Se agregó null al final para telefonoContacto
        Mascota m = new Mascota(null, "Rex", "Perro", "Pastor", "Perdido", 0.0, 0.0, "Jugueton", "user1", "url", null);
        mascotaRepository.save(m);

        List<Mascota> resultado = mascotaRepository.findByEspecieAndEstado("Perro", "Perdido");

        assertFalse(resultado.isEmpty());
        assertEquals("Rex", resultado.get(0).getNombre());
    }

    @Test
    void debeEncontrarPorUsuarioId() {
        // Se agregó null al final para telefonoContacto
        Mascota m = new Mascota(null, "Pelusa", "Gato", "Mestizo", "Encontrado", 0.0, 0.0, "Tranquila", "admin", "url", null);
        mascotaRepository.save(m);

        List<Mascota> resultado = mascotaRepository.findByUsuarioId("admin");

        assertFalse(resultado.isEmpty());
        assertEquals("admin", resultado.get(0).getUsuarioId());
    }
}