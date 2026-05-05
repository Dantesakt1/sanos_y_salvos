package main.java.com.example.geolocalizacion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.DistanciaService;

@RestController
@RequestMapping("/api/geolocalizacion")
@CrossOrigin(origins = "*") 
public class GeolocalizacionController {

    @Autowired
    private DistanciaService distanciaService;

    // pa probar
    // http://localhost:8080/api/geolocalizacion/distancia?lat1=-33.45&lon1=-70.65&lat2=-33.46&lon2=-70.66
    @GetMapping("/distancia")
    public double obtenerDistancia(
            @RequestParam double lat1, 
            @RequestParam double lon1,
            @RequestParam double lat2, 
            @RequestParam double lon2) {
        
        return distanciaService.calcularDistancia(lat1, lon1, lat2, lon2);
    }
}