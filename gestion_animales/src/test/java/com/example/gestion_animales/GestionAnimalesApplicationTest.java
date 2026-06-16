package com.example.gestion_animales;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class GestionAnimalesApplicationTest {

    @Test
    void testMainClass() {
        GestionAnimalesApplication app = new GestionAnimalesApplication();
        assertNotNull(app);
    }
}