package com.example.gestion_animales.controller;

import com.example.gestion_animales.model.Mascota;
import com.example.gestion_animales.repository.MascotaRepository;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;

@WebMvcTest(MascotaController.class)
@AutoConfigureMockMvc(addFilters = false)
class MascotaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MascotaRepository mascotaRepository;

    @MockitoBean
    private KafkaTemplate<String, Mascota> kafkaTemplate;

    @Test
    void debeListarTodasLasMascotas() throws Exception {
        // Se agregó el 11vo parámetro: telefonoContacto
        Mascota m1 = new Mascota(1L, "Luna", "Perro", "Labrador", "Perdido", 0.0, 0.0, "Con collar", "user1", "url", "+56912345678");
        Mascota m2 = new Mascota(2L, "Michi", "Gato", "Siames", "Encontrado", 0.0, 0.0, "Sin collar", "user2", "url", "+56987654321");

        Mockito.when(mascotaRepository.findAll()).thenReturn(Arrays.asList(m1, m2));

        mockMvc.perform(get("/api/mascotas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].nombre").value("Luna"))
                .andExpect(jsonPath("$[1].nombre").value("Michi"));
    }

    @Test
    void debeCrearUnaMascota() throws Exception {
        Mascota mascotaGuardada = new Mascota(1L, "Toby", "Perro", "Quiltro", "Perdido", -33.5, -70.6, "Chico", "user1", "url", "+56911111111");

        Mockito.when(mascotaRepository.save(Mockito.any(Mascota.class))).thenReturn(mascotaGuardada);

        mockMvc.perform(post("/api/mascotas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Toby\",\"especie\":\"Perro\",\"estado\":\"Perdido\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Toby"))
                .andExpect(jsonPath("$.estado").value("Perdido"));
    }

    @Test
    void debeBuscarMascotasCompatibles() throws Exception {
        Mascota m1 = new Mascota(1L, "Rex", "Perro", "Pastor", "Encontrado", 0.0, 0.0, "", "user1", "", null);

        Mockito.when(mascotaRepository.findByEspecieAndEstado("Perro", "Encontrado"))
                .thenReturn(Arrays.asList(m1));

        mockMvc.perform(get("/api/mascotas/buscar-compatibles")
                        .param("especie", "Perro")
                        .param("estado", "Encontrado"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nombre").value("Rex"));
    }


    @Test
    void debeListarMascotasPorUsuario() throws Exception {
        Mascota m1 = new Mascota(1L, "Kiltro", "Perro", "Mestizo", "Perdido", 0.0, 0.0, "", "admin", "", null);

        Mockito.when(mascotaRepository.findByUsuarioId("admin"))
                .thenReturn(Arrays.asList(m1));

        mockMvc.perform(get("/api/mascotas/usuario/admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].usuarioId").value("admin"));
    }

    @Autowired
    private MascotaController mascotaController; 

    @Test
    void debeEjecutarMetodosDeEmergenciaYKafka() {
        java.util.List<Mascota> listaVacia = mascotaController.fallbackListar(new RuntimeException("Fallo BD"));
        org.junit.jupiter.api.Assertions.assertTrue(listaVacia.isEmpty());

        Mascota m = new Mascota();
        Mascota respuestaError = mascotaController.fallbackGrabar(m, new RuntimeException("Fallo BD"));
        org.junit.jupiter.api.Assertions.assertEquals("Sistema temporalmente fuera de línea. Reporte encolado.", respuestaError.getNombre());

        mascotaController.escucharPendientes(m);
        Mockito.verify(mascotaRepository, Mockito.atLeastOnce()).save(m);
    }
}