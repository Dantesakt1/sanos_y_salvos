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
        List<MascotaDto> mascotas = animalesInterface.listarMascotas();

        return mascotas.stream().map(m -> {
            UsuarioDto user = usuarioInterface.obtenerUsuarioPorId(m.getUsuarioId());
            Double distancia = geolocalizacionInterface.obtenerDistancia(latUser, lonUser, m.getLatitud(), m.getLongitud());

            return ReporteDetalladoDto.builder()
                    .mascotaId(m.getId())
                    .nombreMascota(m.getNombre())
                    .especie(m.getEspecie())
                    .estado(m.getEstado())
                    .descripcion(m.getDescripcion())
                    .latitud(m.getLatitud())
                    .longitud(m.getLongitud())
                    .contactoNombre(user.getNombre() + " " + user.getApellido())
                    .contactoTelefono(user.getTelefono())
                    .distanciaKm(distancia)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<ReporteDetalladoDto> fallbackDetalle(double latUser, double lonUser, Throwable t) {
        System.err.println("Error en obtenerMascotaConDistancia: " + t.getMessage());
        return List.of();
    }

    @Override
    public MascotaDto registrarReporteCompleto(MascotaDto mascota) {
        return animalesInterface.grabarMascota(mascota);
    }
}
