import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton, LogoutButton } from './components/LoginLogout'; 

// Importaciones corregidas
import { Navbar } from './pages/Navbar';
import { HomePage } from './pages/HomePage';
import { ReportarPage } from './pages/ReportarPage';
import { CoincidenciasPage } from './pages/CoincidenciasPage';

import './App.css';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="cargando-sistema">Cargando sistema...</div>; 
  }

  return (
    <BrowserRouter>
      {/* El Navbar debe estar siempre visible */}
      <Navbar />

      <main>
        {/* Sección de Login/Logout */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
        </div>

        {/* Sistema de Rutas Protegidas */}
        {isAuthenticated ? (
          <Routes>
            {/* Estas rutas deben coincidir con los "to" de tu Navbar */}
            <Route path="/" element={<HomePage />} />
            <Route path="/reportar" element={<ReportarPage />} />
            <Route path="/coincidencias" element={<CoincidenciasPage />} />
          </Routes>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <h2>Bienvenido a Sanos y Salvos</h2>
            <p>Por favor, inicia sesión para reportar o buscar mascotas.</p>
          </div>
        )}
      </main>
    </BrowserRouter>
  );
}

export default App;