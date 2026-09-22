import React, { useState } from 'react';
import { Inicio } from './Pages/Inicio';
import { Juego } from './Pages/Juego';

export default function App() {
  const [vista, setVista] = useState('inicio');

  return (
    <div className="app-container">
      {vista === 'inicio' ? (
        <Inicio alIniciarJuego={() => setVista('juego')} />
      ) : (
        <Juego alVolverMenu={() => setVista('inicio')} />
      )}
    </div>
  );
}