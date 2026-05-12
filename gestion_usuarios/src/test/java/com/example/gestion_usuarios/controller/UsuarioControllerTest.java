package com.example.gestion_usuarios.controller;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.gestion_usuarios.model.Usuario;
import com.example.gestion_usuarios.repository.UsuarioRepository;

@WebMvcTest(UsuarioController.class)
@Import(SecurityConfig.class)
class UsuarioControllerTest {

    @MockitoBean
    private org.springframework.security.oauth2.jwt.JwtDecoder jwtDecoder;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UsuarioRepository usuarioRepository;

    // --- TEST 1: 401 UNAUTHORIZED ---
    @Test
    void listar_DebeDar401_CuandoNoHayToken() throws Exception {
        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isUnauthorized());
    }

    // --- TEST 2: PERMIT ALL ---
    @Test
    void obtenerPorId_DebeFuncionar_SinToken() throws Exception {
        Usuario mockUser = new Usuario(10L, "Juan", "Perez", "juan@mail.com", "123", "Calle 1", "Stgo");

        when(usuarioRepository.findById(10L)).thenReturn(Optional.of(mockUser));

        mockMvc.perform(get("/api/usuarios/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Juan"));
    }

    // --- TEST 3: SIMULANDO LOGIN ---
    @Test
    @WithMockUser
    void grabar_DebeGuardar_CuandoEstaAutenticado() throws Exception {
        Usuario nuevo = new Usuario(null, "Ana", "Díaz", "ana@mail.com", "456", "Calle 2", "Stgo");
        Usuario guardado = new Usuario(1L, "Ana", "Díaz", "ana@mail.com", "456", "Calle 2", "Stgo");

        when(usuarioRepository.save(any(Usuario.class))).thenReturn(guardado);

        String jsonCuerpo = "{\"nombre\":\"Ana\", \"apellido\":\"Díaz\", \"email\":\"ana@mail.com\"}";

        mockMvc.perform(post("/api/usuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonCuerpo))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }
}