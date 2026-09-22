import React from 'react';

export const Tablero = ({ snake, food, direction }) => {
  const GRID_SIZE = 20;
  const celdas = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const isHead = snake[0]?.x === x && snake[0]?.y === y;
      const isBody = snake.some((seg, idx) => idx !== 0 && seg.x === x && seg.y === y);
      const isFood = food?.x === x && food?.y === y;

      let clase = 'celda';
      let contenido = null;

      if (isHead) {
        clase += ' viper-head';
        contenido = '🐉';
      } else if (isBody) {
        clase += ' viper-body';
      } else if (isFood) {
        clase += ' food-apple';
        contenido = '🍎';
      }

      celdas.push(
        <div key={`${x}-${y}`} className={clase}>
          {contenido}
        </div>
      );
    }
  }

  return <div className="tablero-grid">{celdas}</div>;
};