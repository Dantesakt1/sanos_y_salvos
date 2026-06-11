package com.example.BFF.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import com.example.BFF.DTO.MensajeChat;

// Ojo: Usamos @Controller normal, NO @RestController para WebSockets
@Controller
public class ChatController {

    // Cuando Ionic envíe un mensaje a la ruta "/app/chat/{salaId}"...
    @MessageMapping("/chat/{salaId}")
    // ...Spring Boot lo rebotará automáticamente a todos los conectados a "/topic/sala/{salaId}"
    @SendTo("/topic/sala/{salaId}")
    public MensajeChat enviarMensaje(@DestinationVariable String salaId, MensajeChat mensaje) {
        
        // Aquí le inyectamos la hora del servidor para que sea oficial
        mensaje.setHora(java.time.LocalTime.now().toString().substring(0, 5));
        
        // Retornar el mensaje hace que se envíe por el tubo a la otra persona
        return mensaje;
    }
}