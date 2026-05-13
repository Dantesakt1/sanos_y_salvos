package com.example.BFF.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BFF.service.BFFService;


@RestController
@RequestMapping("/api/bff")
@CrossOrigin(origins = "http://localhost:5173")
public class BFFController {

    @Autowired
    private BFFService bffService;

    @GetMapping("/mascotas-cercanas")
    public List<Object> getMascotas(){
        return  bffService.obtenerMascotaConDistancia(0,0);
    }

    @PostMapping("/reportar")
    public Object crearReporte(@RequestBody Object mascota){
        return bffService.registrarReporteCompleto(mascota);
    }
    
}
