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
    private MascotaClient mascotaClient;

    @Autowired
    private GeolocalizacionClient geoClient;

    @Autowired
    private UsuarioClient usuarioClient;

    // ... (imports y clase igual)

    @KafkaListener(topics = "evento-nueva-mascota", groupId = "motor-coincidencias-group")
    public void procesarNuevaMascota(MascotaDTO mascotaNueva) {

        System.out.println("====== MOTOR DE COINCIDENCIAS: ANALIZANDO '" + mascotaNueva.getNombre() + "' ======");

        try {
            if (mascotaNueva.getLatitud() == null || mascotaNueva.getLongitud() == null) {
                return;
            }

            String estadoActual = mascotaNueva.getEstado().toLowerCase();
            String estadoABuscar = estadoActual.contains("perdid") ? "encontrada" : "perdida";

            List<MascotaDTO> candidatos = mascotaClient.obtenerMascotasCompatibles(mascotaNueva.getEspecie(), estadoABuscar);

            if (candidatos == null || candidatos.isEmpty()) return;

            double radioActual = 2.0;
            double radioMaximo = 100.0;
            int matchesEncontradosEnRonda = 0; // Contador para saber si hallamos algo

            while (radioActual <= radioMaximo) {
                System.out.println("=== Intentando buscar coincidencias en un radio de: " + radioActual + " km ===");
                matchesEncontradosEnRonda = 0;

                for (MascotaDTO candidato : candidatos) {
                    if (candidato == null || candidato.getLatitud() == null || candidato.getLongitud() == null) continue;
                    if (candidato.getId().equals(mascotaNueva.getId())) continue;

                    double kms = geoClient.obtenerDistancia(
                            mascotaNueva.getLatitud(), mascotaNueva.getLongitud(),
                            candidato.getLatitud(), candidato.getLongitud()
                    );

                    if (kms <= radioActual) {
                        matchesEncontradosEnRonda++;

                        // Guardar coincidencia
                        Coincidencia match = new Coincidencia();
                        match.setMascotaPerdidaId(estadoActual.contains("perdid") ? mascotaNueva.getId() : candidato.getId());
                        match.setMascotaEncontradaId(estadoActual.contains("perdid") ? candidato.getId() : mascotaNueva.getId());
                        match.setPorcentajeSimilitud(90.0);
                        match.setFechaCruce(LocalDateTime.now());
                        coincidenciaRepository.save(match);

                        System.out.println("!!! MATCH DETECTADO con '" + candidato.getNombre() + "' a " + kms + " km !!!");
                    }
                }

                // Si encontramos algo, salimos del while porque ya cumplimos el objetivo
                if (matchesEncontradosEnRonda > 0) {
                    System.out.println("=> Se encontraron " + matchesEncontradosEnRonda + " coincidencias en el radio de " + radioActual + " km.");
                    break;
                } else {
                    System.out.println("=> No se encontraron mascotas a " + radioActual + " km. Aumentando radio...");
                    radioActual += 5.0;
                }
            }

            System.out.println("Análisis de '" + mascotaNueva.getNombre() + "' finalizado.");

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}