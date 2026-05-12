// src/pages/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { Heart, Map, Search, Bell, User } from 'lucide-react';

export function Navbar() {
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
        <Link to="/coincidencias" className={esActivo('/coincidencias')}><Search size={18}/> Coincidencias</Link>
      </div>
    </nav>
  );
}