package com.example.demo.controller;

import com.example.demo.model.Coincidencia;
import com.example.demo.repository.CoincidenciaRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CoincidenciaQueryController.class)
@AutoConfigureMockMvc(addFilters = false)
class CoincidenciaQueryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CoincidenciaRepository repository;

    @Test
    void debeListarTodasLasCoincidencias() throws Exception {
        Coincidencia c1 = new Coincidencia();
        c1.setId(1L);
        c1.setPorcentajeSimilitud(90.0);

        Mockito.when(repository.findAll()).thenReturn(Arrays.asList(c1));

        mockMvc.perform(get("/api/coincidencias"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].porcentajeSimilitud").value(90.0));
    }

    @Test
    void debeListarPorMascota() throws Exception {
        Coincidencia c1 = new Coincidencia();
        c1.setId(1L);
        c1.setMascotaPerdidaId(5L); // ID buscado
        c1.setMascotaEncontradaId(10L);

        Mockito.when(repository.findAll()).thenReturn(Arrays.asList(c1));

        mockMvc.perform(get("/api/coincidencias/mascota/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].mascotaPerdidaId").value(5));
    }
}