package com.example.gestion_animales.controller;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(VentaController.class)
@AutoConfigureMockMvc(addFilters = false) // Desactiva seguridad para probar solo la lógica del controlador
class VentaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private KafkaTemplate<String, String> kafkaTemplate;

    @Test
    void debeProcesarVentaYEnviarAKafka() throws Exception {
        // Ejecución de la prueba
        mockMvc.perform(post("/api/ventas/15/3"))
                .andExpect(status().isOk())
                .andExpect(content().string("Venta procesada"));

        // Verificación de que KafkaTemplate se haya llamado correctamente con los parámetros esperados
        Mockito.verify(kafkaTemplate, Mockito.times(1)).send("ventas", "15:3");
    }
}