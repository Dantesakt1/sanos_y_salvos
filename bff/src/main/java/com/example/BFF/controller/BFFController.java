package com.example.BFF.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;

import com.example.BFF.DTO.MascotaDto;
import com.example.BFF.DTO.ReporteDetalladoDto;
import com.example.BFF.service.BFFService;

@RestController
@RequestMapping("/api/bff")
@CrossOrigin(origins = "http://localhost:5173")
public class BFFController {

    private final RestClient restClient;

    @Autowired
    private BFFService bffService;

    // El constructor usa el Builder con LoadBalancer
    public BFFController(RestClient.Builder resBuilderClient) {
        this.restClient = resBuilderClient.baseUrl("http://gestion-animales").build();
    }

    @GetMapping("/mascotas-cercanas")
    public List<ReporteDetalladoDto> getMascotas() {
        // Seguimos usando el Service para la lógica pesada (orquestación)
        return bffService.obtenerMascotaConDistancia(-33.45, -70.66);
    }

    @PostMapping("/reportar")
    public MascotaDto crearReporte(@RequestBody MascotaDto mascota) {
        // Opción usando RestClient (como quiere el profe):
        // Esto se salta la interfaz y va directo al microservicio
        return restClient.post()
                .uri("/api/mascotas")
                .contentType(MediaType.APPLICATION_JSON)
                .body(mascota)
                .retrieve()
                .body(MascotaDto.class);
    }
}