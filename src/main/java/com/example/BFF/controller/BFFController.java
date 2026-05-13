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
        return bffService.obtenerMascotaConDistancia(-33.45, -70.66); // ejemplo: Santiago
    }

   @PostMapping("/reportar")
     public MascotaDto crearReporte(@RequestBody MascotaDto mascota) {
    return bffService.registrarReporteCompleto(mascota);
    }    

}
