import React from 'react';

export const Tablero = ({
  snake,
  food,
  powerup,
  obstacles,
  direction,
  estado,
  puntos,
  nivel,
  reiniciar,
}) => {
  const GRID_SIZE = 20;
  const celdas = [];

  const getEyeRotation = () => {
    if (direction.x === 1) return 'rotate(90deg)';
    if (direction.x === -1) return 'rotate(-90deg)';
    if (direction.y === 1) return 'rotate(180deg)';
    return 'rotate(0deg)';
  };

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const isHead = snake[0]?.x === x && snake[0]?.y === y;
      const isBody = snake.some((seg, idx) => idx !== 0 && seg.x === x && seg.y === y);
      const isFood = food?.x === x && food?.y === y;
      const isPowerup = powerup?.x === x && powerup?.y === y;
      const isObstacle = obstacles.some((obs) => obs.x === x && obs.y === y);

      let clase = 'celda';
      let contenido = null;

      if (isHead) {
        clase += ' snake-head';
        contenido = (
          <span style={{ transform: getEyeRotation(), display: 'inline-block' }}>
            👀
          </span>
        );
      } else if (isBody) {
        clase += ' snake-body';
      } else if (isFood) {
        clase += ' food';
        contenido = '🍎';
      } else if (isPowerup) {
        clase += ` powerup ${powerup.type}`;
        contenido = powerup.icon;
      } else if (isObstacle) {
        clase += ' obstacle';
        contenido = '🪨';
      }

      celdas.push(
        <div key={`${x}-${y}`} className={clase}>
          {contenido}
        </div>
      );
    }
  }

  return (
    <div className="tablero-wrapper">
      <div className="tablero">{celdas}</div>

      {/* 🕹️ OVERLAY GAME OVER PIXEL STYLE */}
      {estado === 'gameover' && (
        <div className="pixel-gameover-overlay">
          <div className="pixel-title">GAME OVER</div>
          <div className="pixel-stats">
            <p>PUNTAJE: {puntos} PTS</p>
            <p>NIVEL ALCANZADO: Lvl {nivel}</p>
            <p style={{ marginTop: '10px', color: '#ffea00' }}>¡CHOQUE DETECTADO!</p>
          </div>
          <button className="pixel-btn" onClick={reiniciar}>
            ► REINTENTAR
          </button>
        </div>
      )}
    </div>
  );
};