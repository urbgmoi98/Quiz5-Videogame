import React from 'react';
import { sound } from '../Utils/sound';

export const Inicio = ({ alIniciarJuego }) => {
  const manejarInsertCoin = () => {
    try {
      if (sound && typeof sound.playCoin === 'function') {
        sound.playCoin();
      }
    } catch (e) {
      console.warn("Audio no iniciado:", e);
    }

    setTimeout(() => {
      if (typeof alIniciarJuego === 'function') {
        alIniciarJuego();
      }
    }, 200);
  };

  return (
    <>
      <div className="bocaraka-bg" />

      <header className="arcade-navbar">
        <div className="brand-title">🐉 BOCARAKÁ ARCADE</div>
        <nav className="nav-group">
          <button className="nav-link-btn active">Inicio</button>
          <button className="nav-link-btn" onClick={manejarInsertCoin}>Jugar</button>
        </nav>
      </header>

      <div className="home-wrapper">
        <div className="arcade-cabinet-home">
          <div className="crt-home-screen">
            <div style={{ fontSize: '3rem', marginBottom: '10px', filter: 'drop-shadow(0 0 12px #05d9e8)' }}>
              🐍
            </div>

            <h1 className="neon-bocaraka-title">Bocaraká</h1>
            <p className="author-tag">By: Moisés</p>

            <div className="insert-coin-container" onClick={manejarInsertCoin}>
              <div className="coin-slot" />
              <button className="insert-coin-btn" type="button">
                ► INSERT COIN ◄
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};