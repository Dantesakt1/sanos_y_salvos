package com.example.geolocalizacion.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DistanciaServiceTest {

    @Test
    void debeCalcularDistanciaCorrectamente() {
        DistanciaService servicio = new DistanciaService();

        // Distancia entre el mismo punto debe ser 0.0
        double distanciaCero = servicio.calcularDistancia(-33.45, -70.65, -33.45, -70.65);
        assertEquals(0.0, distanciaCero);

        // Distancia entre dos puntos distintos (ej. Plaza de Armas vs otro punto en Santiago)
        double distanciaReal = servicio.calcularDistancia(-33.45, -70.65, -33.46, -70.66);
        assertTrue(distanciaReal > 0.0);
    }
}