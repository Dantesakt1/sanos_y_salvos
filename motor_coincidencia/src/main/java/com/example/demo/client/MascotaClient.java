package com.example.demo.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.example.demo.model.MascotaDTO;
import java.util.List;

@FeignClient(name = "gestion-animales")
public interface MascotaClient {

    @GetMapping("/api/mascotas/buscar-compatibles")
    List<MascotaDTO> obtenerMascotasCompatibles(
        @RequestParam("especie") String especie,
        @RequestParam("estado") String estado
    );
}