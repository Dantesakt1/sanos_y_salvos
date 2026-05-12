import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { Heart, Map, Search, Bell } from 'lucide-react';
import { LoginButton, LogoutButton } from '../components/LoginLogout'; 

export function Navbar() {
  const { isAuthenticated, user } = useAuth0();
  const loc = useLocation();

  const esActivo = (ruta) => loc.pathname === ruta ? "nav-link activo" : "nav-link";

  return (
    <nav className="nav-barra">
      <Link to="/" className="nav-logo">
        <Heart fill="currentColor" /> Sanos y Salvos
      </Link>
      
      <div className="nav-enlaces">
        <Link to="/" className={esActivo('/')}>Inicio</Link>
        <Link to="/reportar" className={esActivo('/reportar')}>Reportar Mascota</Link>
        
        {/* Nuevo enlace al Mapa */}
        <Link to="/mapa" className={esActivo('/mapa')}>
          <Map size={18} style={{marginRight: '5px'}}/> Mapa
        </Link>
        
        <Link to="/coincidencias" className={esActivo('/coincidencias')}>
          <Search size={18} style={{marginRight: '5px'}}/> Coincidencias
        </Link>
        
        <div className="nav-usuario-seccion">
          <Bell size={20} className="icono-gris" style={{cursor: 'pointer'}} />
          
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={user.picture} alt={user.name} className="nav-avatar-img" />
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </nav>
  );
}