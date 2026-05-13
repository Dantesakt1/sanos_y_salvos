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
        // 1. Obtenemos la lista base de mascotas
        List<MascotaDto> mascotas = animalesInterface.listarMascotas();

        return mascotas.stream().map(m -> {
            // 2. Buscamos al usuario de forma segura
            UsuarioDto user = null;
            try {
                user = usuarioInterface.obtenerUsuarioPorId(m.getUsuarioId());
            } catch (Exception e) {
                System.err.println("No se pudo obtener el usuario " + m.getUsuarioId());
            }

            // 3. Obtenemos la distancia (con valor por defecto si falla)
            Double distancia = 0.0;
            try {
                distancia = geolocalizacionInterface.obtenerDistancia(latUser, lonUser, m.getLatitud(), m.getLongitud());
            } catch (Exception e) {
                System.err.println("Error calculando distancia para mascota " + m.getId());
            }

            // 4. Construimos el DTO validando que el usuario no sea NULL
            return ReporteDetalladoDto.builder()
                    .mascotaId(m.getId())
                    .nombreMascota(m.getNombre())
                    .especie(m.getEspecie())
                    .estado(m.getEstado())
                    .descripcion(m.getDescripcion())
                    .latitud(m.getLatitud())
                    .longitud(m.getLongitud())
                    // Si el usuario existe, ponemos su nombre; si no, un texto genérico
                    .contactoNombre(user != null ? user.getNombre() + " " + user.getApellido() : "Contacto no disponible")
                    .contactoTelefono(user != null ? user.getTelefono() : "Sin teléfono")
                    .distanciaKm(distancia)
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