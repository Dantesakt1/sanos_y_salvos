package com.example.BFF.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.BFF.DTO.MascotaDto;
import com.example.BFF.DTO.ReporteDetalladoDto;
import com.example.BFF.DTO.UsuarioDto;
import com.example.BFF.interfaces.AnimalesInterface;
import com.example.BFF.interfaces.GeolocalizacionInterface;
import com.example.BFF.interfaces.UsuarioInterface;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

@Service
public class BFFService implements IBFFService {

    @Autowired private AnimalesInterface animalesInterface;
    @Autowired private UsuarioInterface usuarioInterface;
    @Autowired private GeolocalizacionInterface geolocalizacionInterface;

    @CircuitBreaker(name = "bffCircuit", fallbackMethod = "fallbackDetalle")
    @Override
    public List<ReporteDetalladoDto> obtenerMascotaConDistancia(double latUser, double lonUser) {
        // 1. Log para ver si llegan mascotas de gestion-animales
        List<MascotaDto> mascotas = animalesInterface.listarMascotas();
        System.out.println("Mascotas encontradas en DB: " + mascotas.size());

        return mascotas.stream().map(m -> {
            // Inicializamos valores por defecto por si fallan los otros servicios
            String nombreContacto = "Contacto no disponible";
            String telfContacto = "Sin teléfono";
            Double distancia = 0.0;

            // Intentar obtener usuario
            try {
                UsuarioDto user = usuarioInterface.obtenerUsuarioPorId(m.getUsuarioId());
                if (user != null) {
                    nombreContacto = user.getNombre() + " " + user.getApellido();
                    telfContacto = user.getTelefono();
                }
            } catch (Exception e) {
                System.err.println("Error al buscar usuario " + m.getUsuarioId() + ": " + e.getMessage());
            }

            // Intentar obtener distancia
            try {
                distancia = geolocalizacionInterface.obtenerDistancia(latUser, lonUser, m.getLatitud(), m.getLongitud());
            } catch (Exception e) {
                System.err.println("Error en geolocalización: " + e.getMessage());
            }

            return ReporteDetalladoDto.builder()
                    .mascotaId(m.getId())
                    .nombreMascota(m.getNombre())
                    .especie(m.getEspecie())
                    .estado(m.getEstado())
                    .descripcion(m.getDescripcion())
                    .latitud(m.getLatitud())
                    .longitud(m.getLongitud())
                    .contactoNombre(nombreContacto)
                    .contactoTelefono(telfContacto)
                    .distanciaKm(distancia != null ? distancia : 0.0)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<ReporteDetalladoDto> fallbackDetalle(double latUser, double lonUser, Throwable t) {
        System.err.println("Circuit Breaker activado: " + t.getMessage());
        return List.of(); // Devuelve lista vacía en lugar de un error 500
    }

    @Override
    public MascotaDto registrarReporteCompleto(MascotaDto mascota) {
        return animalesInterface.grabarMascota(mascota);
    }
}