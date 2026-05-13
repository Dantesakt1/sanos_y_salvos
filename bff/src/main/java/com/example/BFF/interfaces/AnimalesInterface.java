package com.example.BFF.interfaces;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.BFF.DTO.MascotaDto;
import com.example.BFF.config.FeignConfig;

@FeignClient(name = "gestion-animales", configuration = FeignConfig.class)
public interface AnimalesInterface {

    @GetMapping("/api/mascotas")
    List<MascotaDto> listarMascotas();

    @PostMapping("/api/mascotas")
    MascotaDto grabarMascota(@RequestBody MascotaDto mascota);
}
