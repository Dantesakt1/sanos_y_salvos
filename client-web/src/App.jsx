import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

// Importaciones
import { Navbar } from './pages/Navbar';
import { HomePage } from './pages/HomePage';
import { ReportarPage } from './pages/ReportarPage';
import { CoincidenciasPage } from './pages/CoincidenciasPage';
import { MapaPage } from './pages/MapaPage';
import { MisReportesPage } from './pages/MisReportesPage';

import './App.css';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="cargando-sistema">Cargando sistema...</div>; 
  }

  return (
    <BrowserRouter>
      <Navbar />

      <main>
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/reportar" element={<ReportarPage />} />
            <Route path="/coincidencias" element={<CoincidenciasPage />} />
            <Route path="/mapa" element={<MapaPage />} />
            <Route path="/mis-reportes" element={<MisReportesPage />} />
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