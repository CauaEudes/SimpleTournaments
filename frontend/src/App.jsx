import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Cadastro from './components/Cadastro';
import Login from './components/Login';
import Home from './components/Home';
import './App.css';

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  return (
    <BrowserRouter>
      <div className="app-layout">
        <header className="app-header">
          <div className="header-inner">
            <span className="app-brand">🏆 SimpleTournaments</span>
            {usuarioLogado && (
              <span className="user-badge" aria-label={`Logado como ${usuarioLogado.nome}`}>
                👤 {usuarioLogado.nome}
              </span>
            )}
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login onLogin={setUsuarioLogado} />} />
            <Route
              path="/home"
              element={
                <Home
                  usuarioLogado={usuarioLogado}
                  onSair={() => setUsuarioLogado(null)}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
