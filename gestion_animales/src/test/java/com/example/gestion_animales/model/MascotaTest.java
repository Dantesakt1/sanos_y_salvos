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
    }

    @Test
    void testAllArgsConstructorAndLombokMethods() {
        Mascota mascota1 = new Mascota(1L, "Luna", "Gato", "Siamés", "Perdido", 1.0, 1.0, "Descripción", "user1", "url");
        Mascota mascota2 = new Mascota(1L, "Luna", "Gato", "Siamés", "Perdido", 1.0, 1.0, "Descripción", "user1", "url");
        Mascota mascota3 = new Mascota();

        // Probar equals y hashCode generados por @Data
        assertEquals(mascota1, mascota2);
        assertNotEquals(mascota1, mascota3);
        assertEquals(mascota1.hashCode(), mascota2.hashCode());

        // Probar toString generado por @Data
        assertNotNull(mascota1.toString());
        assertTrue(mascota1.toString().contains("Luna"));
    }

    @Test
    void testLombokHiddenBranches() {
        Mascota mascota = new Mascota(1L, "Luna", "Gato", "Siamés", "Perdido", 1.0, 1.0, "Descripción", "user1", "url");

        // 1. Comparar con null (cubre rama de nulidad)
        assertNotEquals(null, mascota);

        // 2. Comparar con un objeto de otra clase (cubre rama de tipo)
        assertNotEquals(mascota, new Object());

        // 3. Comparar con la misma instancia en memoria (cubre rama de identidad)
        assertEquals(mascota, mascota);

        // 4. Probar setters modificando un objeto y comparando (cubre ramas de diferencia de campos)
        Mascota mascotaDiferente = new Mascota(1L, "Luna", "Gato", "Siamés", "Perdido", 1.0, 1.0, "Descripción", "user1", "url");
        mascotaDiferente.setNombre("Michi");
        assertNotEquals(mascota, mascotaDiferente);
    }
}