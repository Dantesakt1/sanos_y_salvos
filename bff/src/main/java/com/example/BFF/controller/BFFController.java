package com.example.BFF.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.BFF.DTO.MascotaDto;
import com.example.BFF.DTO.ReporteDetalladoDto;
import com.example.BFF.service.BFFService;

@RestController
@RequestMapping("/api/bff")
@CrossOrigin(origins = "http://localhost:5173")
public class BFFController {

    @Autowired
    private BFFService bffService;

    @GetMapping("/mascotas-cercanas")
    public List<ReporteDetalladoDto> getMascotas() {
        return bffService.obtenerMascotaConDistancia(-33.45, -70.66);
    }

    @PostMapping("/reportar")
    public MascotaDto crearReporte(@RequestBody MascotaDto mascota) {
        System.out.println("BFF recibiendo reporte para: " + mascota.getNombre());
        // Usamos el service que ya usa Feign (el cual sí conoce a "gestion-animales")
        return bffService.registrarReporteCompleto(mascota);
    }

    @GetMapping("/mis-reportes/{usuarioId}")
    public List<MascotaDto> getMisReportes(@PathVariable String usuarioId) {
        return bffService.obtenerMisReportes(usuarioId);
    }
}