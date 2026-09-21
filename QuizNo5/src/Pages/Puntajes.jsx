import React, { useEffect, useState } from 'react';
import { TarjetaPuntaje } from '../Components/TarjetaPuntaje';

export const Puntajes = () => {
  const [puntajes, setPuntajes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/puntajes')
      .then(res => res.json())
      .then(data => setPuntajes(data.sort((a, b) => b.puntos - a.puntos)));
  }, []);

  return (
    <div className="fade-in" style={{ width: '400px' }}>
      <h2 style={{ textAlign: 'center', color: '#00E5FF', marginBottom: '20px' }}>Top Jugadores 🌟</h2>
      {puntajes.map(p => (
        <TarjetaPuntaje key={p.id} puntaje={p} />
      ))}
    </div>
  );
};