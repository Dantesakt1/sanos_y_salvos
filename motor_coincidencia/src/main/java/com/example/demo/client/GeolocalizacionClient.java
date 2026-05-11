package com.example.demo.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "geolocalizacion") 
public interface GeolocalizacionClient {

    @GetMapping("/api/geolocalizacion/distancia")
    double obtenerDistancia(
        @RequestParam("lat1") double lat1, @RequestParam("lon1") double lon1,
        @RequestParam("lat2") double lat2, @RequestParam("lon2") double lon2
    );
}