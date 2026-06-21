package com.example.BFF.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.BFF.DTO.CoincidenciaDto;
import com.example.BFF.DTO.MascotaDto;
import com.example.BFF.DTO.ReporteDetalladoDto;
import com.example.BFF.interfaces.CoincidenciaInterface;
import com.example.BFF.service.BFFService;

@RestController
@RequestMapping("/api/bff")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8100"})
public class BFFController {

    @Autowired
    private BFFService bffService;

    @Autowired
    private CoincidenciaInterface coincidenciaInter;

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

    @GetMapping("/coincidencias/mascota/{id}")
        public List<CoincidenciaDto> getCoincidencias(@PathVariable("id") Long id) {
            // Aquí le pedimos al micro 8084 los datos que guardó el ConsumerController
            return coincidenciaInter.obtenerPorMascota(id);
        }
    
    @GetMapping("/coincidencias")
    public List<CoincidenciaDto> getTodasCoincidencias() {
        return coincidenciaInter.obtenerTodas();
    }

    @GetMapping("/mascotas/{id}")
    public ReporteDetalladoDto getMascotaPorId(@PathVariable("id") Long id) {
        return bffService.obtenerMascotaPorId(id);
    }

    @PutMapping("/mascotas/{id}/estado")
    public MascotaDto actualizarEstado(@PathVariable("id") Long id, @RequestBody MascotaDto datos) {
        return bffService.actualizarEstadoMascota(id, datos.getEstado());
    }
}