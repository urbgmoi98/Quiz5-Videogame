import React from 'react';

export const MenuInicio = ({ alComenzar }) => {
  return (
    <div className="start-screen">
      <div className="snake-hero-art">🐉✨</div>
      <h1 className="start-title">BOCARACÁ</h1>
      <p className="start-subtitle">ARCADE EDITION</p>

      <div style={{ margin: '15px 0', fontSize: '0.85rem', color: '#a0aec0', lineHeight: '1.6' }}>
        <p>🐍 Controla a la bocaracá (*Bothriechis schlegelii*)</p>
        <p>🍎 llega lo más lejos posible sin chocar los bordes</p>
      </div>

      <button className="press-start-btn" onClick={alComenzar}>
        ► PRESS START
      </button>
    </div>
  );
};