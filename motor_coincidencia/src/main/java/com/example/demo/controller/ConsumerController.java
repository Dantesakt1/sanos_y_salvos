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
            String estadoActual = mascotaNueva.getEstado().toLowerCase();
            String estadoABuscar = estadoActual.contains("perdid") ? "encontrada" : "perdida";
            
            // MICRÓFONO 1: ¿Qué está a punto de buscar?
            System.out.println("=> Buscando en BD: Especie=" + mascotaNueva.getEspecie() + ", Estado=" + estadoABuscar);
            
            List<MascotaDTO> candidatos = mascotaClient.obtenerMascotasCompatibles(
                mascotaNueva.getEspecie(), 
                estadoABuscar
            );

            // MICRÓFONO 2: ¿Cuántos encontró Gestión Animales?
            System.out.println("=> Candidatos traídos por Feign: " + (candidatos != null ? candidatos.size() : 0));

            for (MascotaDTO candidato : candidatos) {
                if (candidato.getUsuarioId().equals(mascotaNueva.getUsuarioId())) {
                    System.out.println("=> Se ignoró al candidato " + candidato.getId() + " porque es del mismo usuario.");
                    continue; 
                }

                // MICRÓFONO 3: ¿Qué distancia calculó?
                double kms = geoClient.obtenerDistancia(
                    mascotaNueva.getLatitud(), mascotaNueva.getLongitud(),
                    candidato.getLatitud(), candidato.getLongitud()
                );
                System.out.println("=> Distancia calculada con candidato " + candidato.getId() + ": " + kms + " km");

                if (kms <= 5.0) { // Radio de 5 kilómetros
                    
                    // ¡HAY MATCH!
                    Coincidencia match = new Coincidencia();
                    
                    // Asignar IDs correctamente independientemente del género de la palabra
                    if (estadoActual.contains("perdid")) {
                        match.setMascotaPerdidaId(mascotaNueva.getId());
                        match.setMascotaEncontradaId(candidato.getId());
                    } else {
                        match.setMascotaPerdidaId(candidato.getId());
                        match.setMascotaEncontradaId(mascotaNueva.getId());
                    }

                    match.setPorcentajeSimilitud(90.0);
                    match.setFechaCruce(LocalDateTime.now());

                    coincidenciaRepository.save(match);

                    // LOG DE ÉXITO
                    System.out.println("!!! MATCH DETECTADO a " + kms + " km !!!");
                    
                    try {
                        UsuarioDTO contacto = usuarioClient.obtenerUsuarioPorId(candidato.getUsuarioId());
                        System.out.println("Contactar a: " + contacto.getNombre() + " (" + contacto.getTelefono() + ")");
                    } catch (Exception ex) {
                        System.out.println("Match guardado, pero no se pudo obtener info del contacto en este momento.");
                    }
                }
            }
            
            System.out.println("Análisis de '" + mascotaNueva.getNombre() + "' finalizado.");

        } catch (Exception e) {
            System.err.println("Error en el flujo de coincidencia: " + e.getMessage());
        }
    }
}