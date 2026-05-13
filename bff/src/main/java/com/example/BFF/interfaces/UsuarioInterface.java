package com.example.BFF.interfaces;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.BFF.DTO.UsuarioDto;
import com.example.BFF.config.FeignConfig;

@FeignClient(name = "gestion-usuarios", configuration = FeignConfig.class)
public interface UsuarioInterface {

    @GetMapping("/api/usuarios/{id}")
    UsuarioDto obtenerUsuarioPorId(@PathVariable("id") String id);
}
