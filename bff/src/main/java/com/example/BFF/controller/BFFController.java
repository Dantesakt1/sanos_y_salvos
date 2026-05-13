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

    // Cambiamos a inyectar el Builder directamente
    @Autowired
    private RestClient.Builder loadBalancedRestClientBuilder;

    @Autowired
    private BFFService bffService;

    @GetMapping("/mascotas-cercanas")
    public List<ReporteDetalladoDto> getMascotas() {
        return bffService.obtenerMascotaConDistancia(-33.45, -70.66);
    }

    @PostMapping("/reportar")
    public MascotaDto crearReporte(@RequestBody MascotaDto mascota) {
        System.out.println("Enviando reporte de: " + mascota.getNombre() + " al puerto 8081");

        try {
            // CAMBIAMOS EL HOST POR LOCALHOST:8081
            return loadBalancedRestClientBuilder.build()
                    .post()
                    .uri("http://localhost:8081/api/mascotas") // <--- IP y Puerto directo
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(mascota)
                    .retrieve()
                    .body(MascotaDto.class);
        } catch (Exception e) {
            System.err.println("ERROR CRÍTICO: " + e.getMessage());
            throw e;
        }
    }
}