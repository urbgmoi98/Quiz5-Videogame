import React from 'react';

export const Marcador = ({ puntos, vidas, nivel, activePowerUp }) => {
  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '480px',
        padding: '8px 16px',
        marginBottom: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.8 }}>PUNTOS</span>
          <h3 style={{ margin: 0, color: '#0088ff', fontSize: '1.2rem' }}>🫧 {puntos}</h3>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.8 }}>NIVEL</span>
          <h3 style={{ margin: 0, color: '#00cc44', fontSize: '1.2rem' }}>🌟 Lvl {nivel}</h3>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.8 }}>VIDAS</span>
          <h3 style={{ margin: 0, color: '#ff007f', fontSize: '1.2rem' }}>❤️ {vidas}</h3>
        </div>
      </div>

      {/* Badge de Power-up Activo */}
      {activePowerUp && (
        <div style={{ marginTop: '5px' }}>
          <span className="powerup-badge">
            {activePowerUp.icon} {activePowerUp.label} ({activePowerUp.duration}s)
          </span>
        </div>
      )}
    </div>
  );
};