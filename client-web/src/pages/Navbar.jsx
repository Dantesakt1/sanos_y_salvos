import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { Heart, Map, Search, Bell, Home, PlusCircle, ClipboardList } from 'lucide-react';
import { LoginButton, LogoutButton } from '../components/LoginLogout'; 

export function Navbar() {
  const { isAuthenticated, user } = useAuth0();
  const loc = useLocation();

  const esActivo = (ruta) => loc.pathname === ruta ? "nav-link activo" : "nav-link";

  return (
    <nav className="nav-barra">
      <Link to="/" className="nav-logo">
        <Heart fill="currentColor" size={28} /> Sanos y Salvos
      </Link>
      
      <div className="nav-enlaces">
        <Link to="/" className={esActivo('/')}>
          <Home size={18} /> Inicio
        </Link>
        <Link to="/reportar" className={esActivo('/reportar')}>
          <PlusCircle size={18} /> Reportar mascota
        </Link>
        <Link to="/mapa" className={esActivo('/mapa')}>
          <Map size={18} /> Mapa
        </Link>
        
        {/* Aquí estaba el error del ícono repetido */}
        <Link to="/mis-reportes" className={esActivo('/mis-reportes')}>
          <ClipboardList size={18} /> Mis reportes
        </Link>
        
        <Link to="/coincidencias" className={esActivo('/coincidencias')}>
          <Search size={18} /> Coincidencias
        </Link>
        
        <div className="nav-usuario-seccion">
          <Bell size={20} className="icono-gris" style={{cursor: 'pointer', color: '#666'}} />
          
          {isAuthenticated ? (
            <div className="usuario-perfil-auth">
              <img src={user.picture} alt={user.name} className="nav-avatar-img" />
              <div className="btn-auth-container">
                <LogoutButton />
              </div>
            </div>
          ) : (
            <div className="btn-auth-container">
              <LoginButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}