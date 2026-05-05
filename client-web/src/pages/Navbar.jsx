import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Sanos y Salvos</h1>
      <ul>
        <li><Link to="/">Inicio (Menú)</Link></li>
        <li><Link to="/listar">Listar Mascotas</Link></li>
        <li><Link to="/formulario">Reportar Mascota</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;