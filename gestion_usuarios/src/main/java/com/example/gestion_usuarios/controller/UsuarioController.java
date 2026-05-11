package com.example.gestion_usuarios.controller;

import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.gestion_usuarios.model.Usuario;
import com.example.gestion_usuarios.repository.UsuarioRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    @CircuitBreaker(name = "dbUsuarios", fallbackMethod = "fallbackListar")
    @Retry(name = "dbUsuarios")
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    @PostMapping
    @CircuitBreaker(name = "dbUsuarios", fallbackMethod = "fallbackGrabar")
    public Usuario grabar(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Fallbacks
    public List<Usuario> fallbackListar(Throwable e) {
        System.err.println("Error en DB Usuarios: " + e.getMessage());
        return Collections.emptyList();
    }

    public Usuario fallbackGrabar(Usuario usuario, Throwable e) {
        Usuario errorUser = new Usuario();
        errorUser.setNombre("Servicio de usuarios no disponible temporalmente");
        return errorUser;
    }
}