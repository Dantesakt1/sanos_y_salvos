package com.example.gestion_usuarios.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.gestion_usuarios.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

}