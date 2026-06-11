package com.example.BFF.DTO;

public class MensajeChat {
    private String id;
    private String texto;
    private String usuarioId;
    private String hora;

    // Genera aquí tus Getters y Setters vacíos
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public String getUsuarioId() { return usuarioId; }
    public void setUsuarioId(String usuarioId) { this.usuarioId = usuarioId; }
    public String getHora() { return hora; }
    public void setHora(String hora) { this.hora = hora; }
}