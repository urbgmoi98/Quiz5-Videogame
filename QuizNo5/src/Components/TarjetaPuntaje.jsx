import React from 'react';
import { Link } from 'react-router-dom';

export const TarjetaPuntaje = ({ puntaje }) => {
  return (
    <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '15px' }}>
      <span><strong>{puntaje.puntos} pts</strong> - {puntaje.fecha}</span>
      <Link to={`/jugador/${puntaje.id}`} style={{ background: '#FFF5B8', padding: '5px 10px', borderRadius: '15px' }}>
        Ver {puntaje.jugador}
      </Link>
    </div>
  );
};