package com.example.BFF.interfaces;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.BFF.DTO.MascotaDto;
import com.example.BFF.config.FeignConfig;

@FeignClient(name = "gestion-animales", configuration = FeignConfig.class)
public interface AnimalesInterface {

    @GetMapping("/api/mascotas")
    List<MascotaDto> listarMascotas();

    @PostMapping("/api/mascotas")
    MascotaDto grabarMascota(@RequestBody MascotaDto mascota);

    @GetMapping("/api/mascotas/usuario/{usuarioId}")
    List<MascotaDto> listarPorUsuario(@PathVariable("usuarioId") String usuarioId);

    @GetMapping("/api/mascotas/{id}")
    MascotaDto obtenerMascotaPorId(@PathVariable("id") Long id);

    @PutMapping("/api/mascotas/{id}/estado")
    MascotaDto actualizarEstado(@PathVariable("id") Long id, @RequestBody MascotaDto datos);
}
