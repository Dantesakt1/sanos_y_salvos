package com.example.geolocalizacion.service;

import org.springframework.stereotype.Service;

@Service
public class DistanciaService {

    //calculo de distancia entre dos puntos geograficos con la formula de haversine
    public double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {
        final int RADIO_TIERRA_KM = 6371; 
        
        double distanciaLatitud = Math.toRadians(lat2 - lat1);
        double distanciaLongitud = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(distanciaLatitud / 2) * Math.sin(distanciaLatitud / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(distanciaLongitud / 2) * Math.sin(distanciaLongitud / 2);
                
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        double distanciaFinal = RADIO_TIERRA_KM * c; 
        
        // redondeo a dos decimales
        return Math.round(distanciaFinal * 100.0) / 100.0;
    }
}