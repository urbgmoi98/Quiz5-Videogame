import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Inicio } from './Pages/Inicio';
import { Juego } from './Pages/Juego';
import { Puntajes } from './Pages/Puntajes';
import { Jugador } from './Pages/Jugador';

function App() {
  return (
    <BrowserRouter>
      <nav className="glass-panel" style={{ padding: '10px 30px', borderRadius: '30px' }}>
        <Link to="/">Inicio</Link>
        <Link to="/juego">Jugar</Link>
        <Link to="/puntajes">Rankings</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/juego" element={<Juego />} />
        <Route path="/puntajes" element={<Puntajes />} />
        <Route path="/jugador/:id" element={<Jugador />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;