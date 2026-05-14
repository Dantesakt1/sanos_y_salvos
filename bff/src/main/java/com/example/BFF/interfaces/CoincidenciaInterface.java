package com.example.BFF.interfaces;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.BFF.DTO.CoincidenciaDto;

@FeignClient(name = "motor-coincidencia")
public interface CoincidenciaInterface {

    @GetMapping("/api/coincidencias/mascota/{id}")
        List<CoincidenciaDto> obtenerPorMascota(@PathVariable("id") Long id);
    
    @GetMapping("/api/coincidencias") // Sin el /mascota/{id}
        List<CoincidenciaDto> obtenerTodas();
}
