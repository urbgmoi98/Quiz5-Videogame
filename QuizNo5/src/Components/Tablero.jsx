import React from 'react';

export const Tablero = ({ snake, food }) => {
  const GRID_SIZE = 20;
  const celdas = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const isHead = snake[0].x === x && snake[0].y === y;
      const isBody = snake.some((segment, index) => index !== 0 && segment.x === x && segment.y === y);
      const isFood = food.x === x && food.y === y;

      let clase = 'celda';
      let contenido = '';
      if (isHead) { clase += ' snake-head'; contenido = '👀'; }
      else if (isBody) clase += ' snake-body';
      else if (isFood) clase += ' food';

      celdas.push(<div key={`${x}-${y}`} className={clase}>{contenido}</div>);
    }
  }

  return <div className="tablero">{celdas}</div>;
};