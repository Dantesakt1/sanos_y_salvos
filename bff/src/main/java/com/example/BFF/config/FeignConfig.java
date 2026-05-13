package com.example.BFF.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate template) {
                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attributes != null) {
                    HttpServletRequest request = attributes.getRequest();
                    // Extraemos el header Authorization del frontend
                    String authorizationHeader = request.getHeader("Authorization");
                    if (authorizationHeader != null) {
                        // Lo inyectamos en la llamada de Feign hacia el microservicio
                        template.header("Authorization", authorizationHeader);
                    }
                }
            }
        };
    }
}