package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.example.demo.model.MascotaDTO;
import com.example.demo.model.Coincidencia;
import com.example.demo.repository.CoincidenciaRepository;
import com.example.demo.client.MascotaClient;
import com.example.demo.client.GeolocalizacionClient;
import com.example.demo.client.UsuarioClient;
import com.example.demo.model.UsuarioDTO;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConsumerController {

    @Autowired
    private CoincidenciaRepository coincidenciaRepository;

    @Autowired
    private MascotaClient mascotaClient; // Para traer candidatos de gestion_animales

    @Autowired
    private GeolocalizacionClient geoClient; // Tu calculadora de distancias (8083)

    @Autowired
    private UsuarioClient usuarioClient; // Para obtener datos de contacto si hay match

    @KafkaListener(topics = "evento-nueva-mascota", groupId = "motor-coincidencias-group")
    public void procesarNuevaMascota(MascotaDTO mascotaNueva) {
        
        System.out.println("====== MOTOR DE COINCIDENCIAS: ANALIZANDO '" + mascotaNueva.getNombre() + "' ======");

        try {
            // FILTRO 1 y 2: Misma especie y estado opuesto
            String estadoABuscar = mascotaNueva.getEstado().equalsIgnoreCase("PERDIDO") ? "ENCONTRADO" : "PERDIDO";
            
            List<MascotaDTO> candidatos = mascotaClient.obtenerMascotasCompatibles(
                mascotaNueva.getEspecie(), 
                estadoABuscar
            );

            for (MascotaDTO candidato : candidatos) {
                
                // FILTRO 3: Seguridad - No comparar con publicaciones del mismo usuario
                if (candidato.getUsuarioId().equals(mascotaNueva.getUsuarioId())) {
                    continue; 
                }

                // FILTRO 4: Distancia vía Feign (Microservicio 8083)
                double kms = geoClient.obtenerDistancia(
                    mascotaNueva.getLatitud(), mascotaNueva.getLongitud(),
                    candidato.getLatitud(), candidato.getLongitud()
                );

                if (kms <= 5.0) { // Radio de 5 kilómetros
                    
                    // Si llegamos aquí, ¡HAY MATCH!
                    Coincidencia match = new Coincidencia();
                    
                    if (mascotaNueva.getEstado().equalsIgnoreCase("PERDIDO")) {
                        match.setMascotaPerdidaId(mascotaNueva.getId());
                        match.setMascotaEncontradaId(candidato.getId());
                    } else {
                        match.setMascotaPerdidaId(candidato.getId());
                        match.setMascotaEncontradaId(mascotaNueva.getId());
                    }

                    match.setPorcentajeSimilitud(90.0); // Similitud base por especie/distancia
                    match.setFechaCruce(LocalDateTime.now());

                    coincidenciaRepository.save(match);

                    // OBTENER CONTACTOS PARA EL LOG/AVISO
                    UsuarioDTO contacto = usuarioClient.obtenerUsuarioPorId(candidato.getUsuarioId());
                    System.out.println("!!! MATCH DETECTADO a " + kms + " km !!!");
                    System.out.println("Contactar a: " + contacto.getNombre() + " (" + contacto.getTelefono() + ")");
                }
            }
            
            System.out.println("Análisis de '" + mascotaNueva.getNombre() + "' finalizado.");

        } catch (Exception e) {
            System.err.println("Error en el flujo de coincidencia: " + e.getMessage());
        }
    }
}