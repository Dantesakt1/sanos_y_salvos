package com.example.demo.controller;

import com.example.demo.client.GeolocalizacionClient;
import com.example.demo.client.MascotaClient;
import com.example.demo.client.UsuarioClient;
import com.example.demo.model.Coincidencia;
import com.example.demo.model.MascotaDTO;
import com.example.demo.model.UsuarioDTO;
import com.example.demo.repository.CoincidenciaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;

@ExtendWith(MockitoExtension.class)
class ConsumerControllerTest {

    @InjectMocks
    private ConsumerController consumerController;

    @Mock
    private CoincidenciaRepository coincidenciaRepository;

    @Mock
    private MascotaClient mascotaClient;

    @Mock
    private GeolocalizacionClient geoClient;

    @Mock
    private UsuarioClient usuarioClient;

    @Test
    void debeProcesarNuevaMascotaYCrearMatch() {
        // 1. Preparar "Mascota Perdida"
        MascotaDTO mascotaNueva = new MascotaDTO();
        mascotaNueva.setId(1L);
        mascotaNueva.setNombre("Luna");
        mascotaNueva.setEstado("Perdido");
        mascotaNueva.setEspecie("Perro");
        mascotaNueva.setUsuarioId("user1");
        mascotaNueva.setLatitud(-33.0);
        mascotaNueva.setLongitud(-70.0);

        // 2. Preparar Mascota Encontrada por OTRO usuario
        MascotaDTO candidato = new MascotaDTO();
        candidato.setId(2L);
        candidato.setUsuarioId("user2");
        candidato.setLatitud(-33.01);
        candidato.setLongitud(-70.01);

        UsuarioDTO contacto = new UsuarioDTO();
        contacto.setNombre("Juan");
        contacto.setTelefono("123456");

        // 3. Simular respuestas de los Feign Clients
        Mockito.when(mascotaClient.obtenerMascotasCompatibles("Perro", "encontrada"))
                .thenReturn(Arrays.asList(candidato));

        // Simular que están cerca (3.0 km)
        Mockito.when(geoClient.obtenerDistancia(anyDouble(), anyDouble(), anyDouble(), anyDouble()))
                .thenReturn(3.0);

        Mockito.when(usuarioClient.obtenerUsuarioPorId("user2"))
                .thenReturn(contacto);

        // 4. Ejecutar el método
        consumerController.procesarNuevaMascota(mascotaNueva);

        // 5. Verificar que se guardó el Match en la base de datos
        Mockito.verify(coincidenciaRepository, Mockito.times(1)).save(any(Coincidencia.class));
    }
}