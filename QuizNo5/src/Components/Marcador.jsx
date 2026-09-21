import React from 'react';

export const Marcador = ({ puntos, vidas, nivel }) => {
  return (
    <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', marginBottom: '10px' }}>
      <h3 style={{ margin: 0 }}>🫧 Puntos: {puntos}</h3>
      <h3 style={{ margin: 0, color: '#FF8FD1' }}>❤️ Vidas: {vidas}</h3>
      <h3 style={{ margin: 0, color: '#00E5FF' }}>🌟 Nivel: {nivel}</h3>
    </div>
  );
};