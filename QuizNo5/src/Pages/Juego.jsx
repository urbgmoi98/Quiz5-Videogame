import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tablero } from '../components/Tablero';
import { Marcador } from '../components/Marcador';
import { Menu } from '../components/Menu';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIR = { x: 0, y: -1 };

export const Juego = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [estado, setEstado] = useState('idle'); // idle | playing | paused | gameover
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(3);

  // useRef para la dirección evita que el timer (setInterval) se reinicie al presionar teclas
  const dirRef = useRef(INITIAL_DIR);

  const cambiarDireccion = useCallback((nuevaDir) => {
    const actual = dirRef.current;
    // Evita que la serpiente retroceda sobre su propio cuello
    if (nuevaDir.x !== 0 && actual.x === 0) dirRef.current = nuevaDir;
    if (nuevaDir.y !== 0 && actual.y === 0) dirRef.current = nuevaDir;
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault(); // Evita scroll en la ventana del navegador
    }

    switch (e.key) {
      case 'ArrowUp': cambiarDireccion({ x: 0, y: -1 }); break;
      case 'ArrowDown': cambiarDireccion({ x: 0, y: 1 }); break;
      case 'ArrowLeft': cambiarDireccion({ x: -1, y: 0 }); break;
      case 'ArrowRight': cambiarDireccion({ x: 1, y: 0 }); break;
      default: break;
    }
  }, [cambiarDireccion]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (estado !== 'playing') return;

    const timer = setInterval(() => {
      setSnake((prevSnake) => {
        const dir = dirRef.current;
        const nuevaCabeza = {
          x: prevSnake[0].x + dir.x,
          y: prevSnake[0].y + dir.y,
        };

        // Colisión con paredes
        if (
          nuevaCabeza.x < 0 ||
          nuevaCabeza.x >= GRID_SIZE ||
          nuevaCabeza.y < 0 ||
          nuevaCabeza.y >= GRID_SIZE
        ) {
          manejarColision();
          return prevSnake;
        }

        // Colisión con cuerpo
        if (prevSnake.some((seg) => seg.x === nuevaCabeza.x && seg.y === nuevaCabeza.y)) {
          manejarColision();
          return prevSnake;
        }

        const nuevaSerpiente = [nuevaCabeza, ...prevSnake];

        // Detección de comida
        setFood((currentFood) => {
          if (nuevaCabeza.x === currentFood.x && nuevaCabeza.y === currentFood.y) {
            setPuntos((p) => p + 10);
            return {
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE),
            };
          }
          nuevaSerpiente.pop(); // Quita la cola si no comió
          return currentFood;
        });

        return nuevaSerpiente;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [estado]);

  const manejarColision = () => {
    setVidas((v) => {
      if (v - 1 <= 0) {
        setEstado('gameover');
        return 0;
      }
      setEstado('paused');
      setSnake(INITIAL_SNAKE);
      dirRef.current = INITIAL_DIR;
      return v - 1;
    });
  };

  const reiniciar = () => {
    setEstado('idle');
    setSnake(INITIAL_SNAKE);
    dirRef.current = INITIAL_DIR;
    setPuntos(0);
    setVidas(3);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Marcador puntos={puntos} vidas={vidas} nivel={Math.floor(puntos / 50) + 1} />

      {estado === 'gameover' && <h2 style={{ color: '#FF8FD1', margin: '10px' }}>¡FIN DEL JUEGO! 💥</h2>}

      <Tablero snake={snake} food={food} />

      <Menu
        estado={estado}
        iniciar={() => setEstado('playing')}
        pausar={() => setEstado('paused')}
        reiniciar={reiniciar}
      />

      {/* Controles en Pantalla (D-Pad Y2K) */}
      <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
        <button className="btn-y2k" style={{ padding: '5px 15px' }} onClick={() => cambiarDireccion({ x: 0, y: -1 })}>▲</button>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn-y2k" style={{ padding: '5px 15px' }} onClick={() => cambiarDireccion({ x: -1, y: 0 })}>◄</button>
          <button className="btn-y2k" style={{ padding: '5px 15px' }} onClick={() => cambiarDireccion({ x: 0, y: 1 })}>▼</button>
          <button className="btn-y2k" style={{ padding: '5px 15px' }} onClick={() => cambiarDireccion({ x: 1, y: 0 })}>►</button>
        </div>
      </div>
    </div>
  );
};