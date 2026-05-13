package com.example.BFF.interfaces;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "geolocalizacion", url = "http://localhost:8083")
public interface GeolocalizacionInterface {

    @GetMapping("/api/geolocalizacion/distancia")
    Double obtenerDistancia(@RequestParam double lat1, @RequestParam double lon1,
                             @RequestParam double lat2, @RequestParam double lon2);
}
