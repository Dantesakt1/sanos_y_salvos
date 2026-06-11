package com.example.BFF.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // "/topic" será el prefijo para los canales donde los usuarios escucharán los mensajes
        config.enableSimpleBroker("/topic");
        // "/app" será el prefijo adonde Ionic enviará los mensajes
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Al quitar withSockJS(), forzamos a que use WebSockets 100% nativos
        registry.addEndpoint("/ws-chat")
                .setAllowedOrigins("http://localhost:8100", "http://localhost:5173"); 
    }
}