package com.example.gestion_animales.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.gestion_animales.model.Mascota;
import com.example.gestion_animales.repository.MascotaRepository;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/mascotas")
@CrossOrigin(origins = "*")
public class MascotaController {
    
    @Autowired
    private MascotaRepository mascotaRepository;
    
    @Autowired
    private KafkaTemplate<String, Mascota> kafkaTemplate;

    @GetMapping
    @CircuitBreaker(name = "dbMascotas", fallbackMethod = "fallbackListar")
    @Retry(name = "dbMascotas")
    public List<Mascota> listar() {
        return mascotaRepository.findAll();
    }

    @PostMapping
    @CircuitBreaker(name = "dbMascotas", fallbackMethod = "fallbackGrabar")
    public Mascota grabar(@RequestBody Mascota mascota) {
        mascota.setId(null); 
        Mascota m = mascotaRepository.save(mascota);
        
        kafkaTemplate.send("evento-nueva-mascota", m);
        System.out.println("Evento enviado a Kafka para la mascota ID: " + m.getId());
        
        return m;
    }
    


    // Si la DB falla al listar, devolvemos una lista vacía para no romper el frontend
    public List<Mascota> fallbackListar(Throwable e) {
        System.err.println("Error al listar mascotas: " + e.getMessage());
        return Collections.emptyList(); 
    }

    // Si la DB principal falla al grabar, guardamos en un topic temporal
    public Mascota fallbackGrabar(Mascota mascota, Throwable e) {
        System.err.println("Error al grabar, circuito abierto: " + e.getMessage());
        
        kafkaTemplate.send("mascotas-pendientes", mascota);
        
        Mascota errorMascota = new Mascota();
        errorMascota.setNombre("Sistema temporalmente fuera de línea. Reporte encolado.");
        return errorMascota;
    }
    
    @KafkaListener(topics = "mascotas-pendientes", groupId = "mascotas-group")
    public void escucharPendientes(Mascota mascota) {
        mascotaRepository.save(mascota);
        System.out.println("Mascota pendiente guardada exitosamente.");
    }

    //para el motor-coincidencia
    @GetMapping("/buscar-compatibles")
    @CircuitBreaker(name = "dbMascotas", fallbackMethod = "fallbackListar")
    public List<Mascota> buscarCompatibles(@RequestParam String especie, @RequestParam String estado) {
        System.out.println("Buscando candidatos: " + especie + " - " + estado);
        return mascotaRepository.findByEspecieAndEstado(especie, estado);
    }
}