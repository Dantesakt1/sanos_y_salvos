package com.example.BFF.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.BFF.DTO.MascotaDto;

@FeignClient(name = "gestion-animales", url = "http://localhost:8081")
public interface AnimalesClient {

    @GetMapping("/api/mascotas")
    List<MascotaDto> listarMascotas();

    @PostMapping("/api/mascotas")
    MascotaDto grabarMascota(@RequestBody MascotaDto mascota);
}
    