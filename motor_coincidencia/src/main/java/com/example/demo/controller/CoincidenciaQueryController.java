package com.example.demo.controller;

import com.example.demo.model.Coincidencia;
import com.example.demo.repository.CoincidenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coincidencias")
public class CoincidenciaQueryController {

    @Autowired
    private CoincidenciaRepository repository;

    // Este lo usará el BFF para mostrar las coincidencias de una mascota específica
    @GetMapping("/mascota/{id}")
    public List<Coincidencia> obtenerPorMascota(@PathVariable Long id) {
        // En el repository deberías añadir: 
        // List<Coincidencia> findByMascotaPerdidaIdOrMascotaEncontradaId(Long pId, Long eId);
        return repository.findAll().stream()
                .filter(c -> c.getMascotaPerdidaId().equals(id) || c.getMascotaEncontradaId().equals(id))
                .toList();
    }
}