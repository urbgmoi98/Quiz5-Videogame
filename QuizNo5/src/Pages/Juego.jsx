import React, { useState, useEffect, useCallback } from 'react';
import { Tablero } from '../components/Tablero';
import { Marcador } from '../components/Marcador';
import { Menu } from '../components/Menu';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export const Juego = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [estado, setEstado] = useState('idle'); // idle | playing | paused | gameover
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(3);

  // Hook obligatorio justificado: useCallback evita que la función de manejo de teclado se recree en cada render,
  // optimizando la respuesta del evento listener que se monta en el useEffect.
  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
      case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
      case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
      case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      default: break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (estado !== 'playing') return;

    const moverSerpiente = setInterval(() => {
      setSnake(prev => {
        const nuevaCabeza = { x: prev[0].x + direction.x, y: prev[0].y + direction.y };

        // Colisión bordes
        if (nuevaCabeza.x < 0 || nuevaCabeza.x >= GRID_SIZE || nuevaCabeza.y < 0 || nuevaCabeza.y >= GRID_SIZE) {
          manejarColision();
          return prev;
        }
        
        // Colisión cuerpo
        if (prev.some(segment => segment.x === nuevaCabeza.x && segment.y === nuevaCabeza.y)) {
          manejarColision();
          return prev;
        }

        const nuevaSerpiente = [nuevaCabeza, ...prev];

        // Comer comida
        if (nuevaCabeza.x === food.x && nuevaCabeza.y === food.y) {
          setPuntos(p => p + 10);
          generarComida();
          // Micro-animación/sonido iría aquí (audio.play())
        } else {
          nuevaSerpiente.pop();
        }

        return nuevaSerpiente;
      });
    }, 200);

    return () => clearInterval(moverSerpiente);
  }, [estado, direction, food]);

  const manejarColision = () => {
    setVidas(v => {
      if (v - 1 <= 0) {
        setEstado('gameover');
        return 0;
      }
      setEstado('paused');
      setSnake(INITIAL_SNAKE);
      return v - 1;
    });
  };

  const generarComida = () => {
    setFood({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    });
  };

  return (
    <div className="fade-in">
      <Marcador puntos={puntos} vidas={vidas} nivel={Math.floor(puntos / 50) + 1} />
      {estado === 'gameover' && <h2 style={{ textAlign: 'center', color: '#FF8FD1' }}>¡FIN DEL JUEGO! 💥</h2>}
      <Tablero snake={snake} food={food} />
      <Menu 
        estado={estado} 
        iniciar={() => setEstado('playing')} 
        pausar={() => setEstado('paused')} 
        reiniciar={() => { setEstado('idle'); setSnake(INITIAL_SNAKE); setPuntos(0); setVidas(3); }} 
      />
    </div>
  );
};