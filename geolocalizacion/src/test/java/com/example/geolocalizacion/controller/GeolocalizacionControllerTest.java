package com.example.geolocalizacion.controller;

import com.example.geolocalizacion.service.DistanciaService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GeolocalizacionController.class)
@AutoConfigureMockMvc(addFilters = false)
class GeolocalizacionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DistanciaService distanciaService;

    @Test
    void debeDevolverDistancia() throws Exception {
        // Simulamos que el servicio matemático nos responde 1.45 kilómetros
        Mockito.when(distanciaService.calcularDistancia(-33.45, -70.65, -33.46, -70.66))
                .thenReturn(1.45);

        // Llamamos al endpoint tal como lo haría el BFF o el Motor
        mockMvc.perform(get("/api/geolocalizacion/distancia")
                        .param("lat1", "-33.45")
                        .param("lon1", "-70.65")
                        .param("lat2", "-33.46")
                        .param("lon2", "-70.66"))
                .andExpect(status().isOk())
                .andExpect(content().string("1.45"));
    }
}