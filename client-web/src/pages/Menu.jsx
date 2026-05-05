import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Panel de Control</h2>
      <p>¿Qué deseas hacer hoy?</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <Link to="/formulario" style={{ textDecoration: 'none' }}>
          <button className="button">Reportar Extravío/Hallazgo</button>
        </Link>
        <Link to="/listar" style={{ textDecoration: 'none' }}>
          <button className="button logout">Ver Listado General</button>
        </Link>
      </div>
    </div>
  );
};

export default Menu;