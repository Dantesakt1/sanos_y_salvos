package com.example.gestion_animales.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class MascotaTest {

    @Test
    void testGettersAndSetters() {
        Mascota mascota = new Mascota();

        mascota.setId(1L);
        mascota.setNombre("Firulais");
        mascota.setEspecie("Perro");
        mascota.setRaza("Kiltro");
        mascota.setEstado("Encontrado");
        mascota.setLatitud(-33.5);
        mascota.setLongitud(-70.6);
        mascota.setDescripcion("Muy amigable");
        mascota.setUsuarioId("user123");
        mascota.setFotoUrl("http://mifoto.com/1.jpg");
        mascota.setTelefonoContacto("+56912345678"); // Testeando el nuevo atributo

        assertEquals(1L, mascota.getId());
        assertEquals("Firulais", mascota.getNombre());
        assertEquals("Perro", mascota.getEspecie());
        assertEquals("Kiltro", mascota.getRaza());
        assertEquals("Encontrado", mascota.getEstado());
        assertEquals(-33.5, mascota.getLatitud());
        assertEquals(-70.6, mascota.getLongitud());
        assertEquals("Muy amigable", mascota.getDescripcion());
        assertEquals("user123", mascota.getUsuarioId());
        assertEquals("http://mifoto.com/1.jpg", mascota.getFotoUrl());
        assertEquals("+56912345678", mascota.getTelefonoContacto());
    }

    @Test
    void testAllArgsConstructorAndLombokMethods() {
        // Se agregó null al final para el telefonoContacto
        Mascota mascota1 = new Mascota(1L, "Luna", "Gato", "Siamés", "Perdido", 1.0, 1.0, "Descripción", "user1", "url", null);
        Mascota mascota2 = new Mascota(1L, "Luna", "Gato", "Siamés", "Perdido", 1.0, 1.0, "Descripción", "user1", "url", null);
        Mascota mascota3 = new Mascota();

        assertEquals(mascota1, mascota2);
        assertNotEquals(mascota1, mascota3);
        assertEquals(mascota1.hashCode(), mascota2.hashCode());

        assertNotNull(mascota1.toString());
        assertTrue(mascota1.toString().contains("Luna"));
    }

    @Test
    void testLombokHiddenBranches() {
        Mascota mascota = new Mascota(1L, "Luna", "Gato", "Siamés", "Perdido", 1.0, 1.0, "Descripción", "user1", "url", null);

        assertNotEquals(null, mascota);
        assertNotEquals(mascota, new Object());
        assertEquals(mascota, mascota);

        Mascota mascotaDiferente = new Mascota(1L, "Luna", "Gato", "Siamés", "Perdido", 1.0, 1.0, "Descripción", "user1", "url", null);
        mascotaDiferente.setNombre("Michi");
        assertNotEquals(mascota, mascotaDiferente);
    }
}