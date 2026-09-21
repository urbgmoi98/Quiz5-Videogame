import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export const Jugador = () => {
  const { id } = useParams();
  const [jugador, setJugador] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/jugadores/${id}`)
      .then(res => res.json())
      .then(data => setJugador(data));
  }, [id]);

  if (!jugador) return <div className="glass-panel">Cargando datos líquidos... 🫧</div>;

  return (
    <div className="glass-panel fade-in" style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>{jugador.avatar}</h1>
      <h2>{jugador.nombre}</h2>
      <p>ID de Red: {jugador.id}</p>
      <Link to="/puntajes" style={{ display: 'block', marginTop: '20px' }}>← Volver a Ránking</Link>
    </div>
  );
};