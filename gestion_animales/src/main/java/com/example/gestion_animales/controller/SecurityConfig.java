package com.example.gestion_animales.controller;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public JwtDecoder jwtDecoder(){
        return JwtDecoders.fromIssuerLocation("https://dev-dantesakt1.us.auth0.com/");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) 
       throws Exception{
          http
             .csrf(csrf-> csrf.disable())
             .cors(cors-> cors.configurationSource(request->{
                var config = new CorsConfiguration();
                config.setAllowedOrigins(List.of("http://localhost:5173"));
                config.setAllowedMethods(List.of("GET","POST","PUT","DELETE"));
                config.setAllowedHeaders(List.of("*"));
                return config;
             }))
             .authorizeHttpRequests(auth->auth
                .requestMatchers("/api/mascotas/buscar-compatibles").permitAll()
                .requestMatchers("/api/mascotas/**").authenticated()
                .anyRequest().permitAll()
             )
             .oauth2ResourceServer(oauth2-> 
                oauth2.jwt(Customizer.withDefaults()));
        return http.build();
    }
}