import React from 'react';

export const Tablero = ({ snake, food, direction }) => {
  const GRID_SIZE = 20;
  const celdas = [];

  // Rotar los ojos según el sentido del movimiento
  const getEyeRotation = () => {
    if (direction.x === 1) return 'rotate(90deg)';
    if (direction.x === -1) return 'rotate(-90deg)';
    if (direction.y === 1) return 'rotate(180deg)';
    return 'rotate(0deg)'; // Arriba
  };

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const isHead = snake[0]?.x === x && snake[0]?.y === y;
      const isBody = snake.some((seg, idx) => idx !== 0 && seg.x === x && seg.y === y);
      const isFood = food.x === x && food.y === y;

      let clase = 'celda';
      let contenido = null;

      if (isHead) {
        clase += ' snake-head';
        contenido = (
          <span style={{ transform: getEyeRotation(), display: 'inline-block', transition: 'transform 0.1s' }}>
            👀
          </span>
        );
      } else if (isBody) {
        clase += ' snake-body';
      } else if (isFood) {
        clase += ' food';
        contenido = '🫧';
      }

      celdas.push(
        <div key={`${x}-${y}`} className={clase}>
          {contenido}
        </div>
      );
    }
  }

  return (
    <div className="tablero-container">
      <div className="tablero">{celdas}</div>
    </div>
  );
};