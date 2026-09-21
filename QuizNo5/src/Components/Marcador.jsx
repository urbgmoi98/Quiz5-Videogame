import React from 'react';

export const Marcador = ({ puntos, vidas, nivel }) => {
  return (
    <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', maxWidth: '480px', padding: '12px 20px', marginBottom: '15px' }}>
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#0a2a43', fontWeight: 900, opacity: 0.8 }}>PUNTOS</span>
        <h2 style={{ margin: 0, color: '#0088ff', textShadow: '0 0 8px rgba(0,229,255,0.6)', fontSize: '1.5rem' }}>🫧 {puntos}</h2>
      </div>
      <div style={{ width: '2px', height: '30px', background: 'rgba(255,255,255,0.6)' }}></div>
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#0a2a43', fontWeight: 900, opacity: 0.8 }}>VIDAS</span>
        <h2 style={{ margin: 0, color: '#ff007f', textShadow: '0 0 8px rgba(255,143,209,0.8)', fontSize: '1.5rem' }}>❤️ {vidas}</h2>
      </div>
      <div style={{ width: '2px', height: '30px', background: 'rgba(255,255,255,0.6)' }}></div>
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#0a2a43', fontWeight: 900, opacity: 0.8 }}>NIVEL</span>
        <h2 style={{ margin: 0, color: '#00cc44', textShadow: '0 0 8px rgba(124,255,178,0.8)', fontSize: '1.5rem' }}>🌟 {nivel}</h2>
      </div>
    </div>
  );
};