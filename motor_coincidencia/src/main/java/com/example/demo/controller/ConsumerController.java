package com.example.demo.controller;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

// Importamos el DTO que creaste
import com.example.demo.model.MascotaDTO; 

@Service
public class ConsumerController {

    @KafkaListener(topics = "evento-nueva-mascota", groupId = "motor-coincidencias-group", concurrency="3")
    public void procesarNuevaMascota(MascotaDTO mascotaNueva) { 
        
        System.out.println("====== MOTOR DE COINCIDENCIAS ACTIVO ======");
        System.out.println("Recibido evento asíncrono para Mascota ID: " + mascotaNueva.getId());
        
        try {

            
            System.out.println("Analizando coincidencias para: " + mascotaNueva.getNombre() + 
                               " (Especie: " + mascotaNueva.getEspecie() + 
                               ", Estado: " + mascotaNueva.getEstado() + ")");
            
            if (mascotaNueva.getEstado().equalsIgnoreCase("PERDIDO")) {
                System.out.println("Buscando en la BD de mascotas 'ENCONTRADAS' por especie, raza y ubicación...");
            } else if (mascotaNueva.getEstado().equalsIgnoreCase("ENCONTRADO")) {
                System.out.println("Buscando en la BD de mascotas 'PERDIDAS' por especie, raza y ubicación...");
            }

            System.out.println("Análisis finalizado exitosamente.");
            
        } catch (Exception e) {
            System.err.println("Error procesando coincidencia en segundo plano: " + e.getMessage());
        }
    }
}