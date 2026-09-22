import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tablero } from '../Components/Tablero';
import { sound } from '../Utils/sound';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIR = { x: 0, y: -1 };
const INITIAL_FOOD = { x: 5, y: 5 };

// Lista simulada de High Scores (se actualiza automáticamente con la puntuación obtenida)
const MOCK_HIGH_SCORES = [
  { id: 1, nombre: 'Moisés', puntaje: 180 },
  { id: 2, nombre: 'Elvis Tek', puntaje: 140 },
  { id: 3, nombre: 'BOCARAKÁ', puntaje: 100 },
  { id: 4, nombre: 'VIPER_99', puntaje: 60 },
];

export const Juego = ({ alVolverMenu }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [estado, setEstado] = useState('playing'); // playing | paused | gameover
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [highScores, setHighScores] = useState(MOCK_HIGH_SCORES);

  const dirRef = useRef(INITIAL_DIR);
  const nivel = Math.floor(puntos / 40) + 1;

  const cambiarDireccion = useCallback((nuevaDir) => {
    const actual = dirRef.current;
    if (nuevaDir.x !== 0 && actual.x === 0) dirRef.current = nuevaDir;
    if (nuevaDir.y !== 0 && actual.y === 0) dirRef.current = nuevaDir;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === ' ') {
        setEstado((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
        return;
      }
      switch (e.key) {
        case 'ArrowUp': cambiarDireccion({ x: 0, y: -1 }); break;
        case 'ArrowDown': cambiarDireccion({ x: 0, y: 1 }); break;
        case 'ArrowLeft': cambiarDireccion({ x: -1, y: 0 }); break;
        case 'ArrowRight': cambiarDireccion({ x: 1, y: 0 }); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cambiarDireccion]);

  useEffect(() => {
    if (estado !== 'playing') return;
    const velocidad = Math.max(60, 130 - (nivel - 1) * 12);

    const timer = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const nextHead = { x: head.x + dirRef.current.x, y: head.y + dirRef.current.y };

        if (nextHead.x < 0 || nextHead.x >= GRID_SIZE || nextHead.y < 0 || nextHead.y >= GRID_SIZE) {
          try { sound.playHit(); } catch (e) {}
          manejarColision();
          return prev;
        }

        if (prev.some((seg) => seg.x === nextHead.x && seg.y === nextHead.y)) {
          try { sound.playHit(); } catch (e) {}
          manejarColision();
          return prev;
        }

        const nuevaSerpiente = [nextHead, ...prev];

        if (nextHead.x === food.x && nextHead.y === food.y) {
          try { sound.playEat(); } catch (e) {}
          setPuntos((p) => p + 10);
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
        } else {
          nuevaSerpiente.pop();
        }

        return nuevaSerpiente;
      });
    }, velocidad);

    return () => clearInterval(timer);
  }, [estado, nivel, food]);

  const actualizarHighScores = (nuevoPuntaje) => {
    const nuevaLista = [...highScores, { id: Date.now(), nombre: 'TÚ', puntaje: nuevoPuntaje }]
      .sort((a, b) => b.puntaje - a.puntaje)
      .slice(0, 5);
    setHighScores(nuevaLista);
  };

  const manejarColision = () => {
    setVidas((v) => {
      if (v - 1 <= 0) {
        try { sound.playGameOver(); } catch (e) {}
        actualizarHighScores(puntos);
        setEstado('gameover');
        return 0;
      }
      setEstado('paused');
      dirRef.current = INITIAL_DIR;
      setSnake(INITIAL_SNAKE);
      return v - 1;
    });
  };

  const reiniciarJuego = () => {
    setSnake(INITIAL_SNAKE);
    dirRef.current = INITIAL_DIR;
    setPuntos(0);
    setVidas(3);
    setEstado('playing');
  };

  return (
    <>
      <div className="bocaraka-bg" />

      <header className="arcade-navbar">
        <div className="brand-title">🐉 BOTHRIECHIS VIPER</div>
        <nav className="nav-group">
          <button className="nav-link-btn" onClick={alVolverMenu}>Inicio</button>
          <button className="nav-link-btn active">Jugar</button>
        </nav>
      </header>

      <div className="home-wrapper">
        <div className="arcade-cabinet-home">
          <div className="crt-home-screen">
            {/* Header marcador */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '8px', fontFamily: "'Press Start 2P', monospace", fontSize: '0.6rem', color: '#05d9e8' }}>
              <span>SCORE: {puntos}</span>
              <span>LVL: {nivel}</span>
              <span>LIVES: {'❤️'.repeat(vidas)}</span>
            </div>

            {/* Tablero de Juego */}
            <Tablero snake={snake} food={food} direction={dirRef.current} />

            {/* OVERLAY GLITCH GAME OVER & HIGH SCORES */}
            {estado === 'gameover' && (
              <div className="glitch-gameover-overlay">
                <h1 className="glitch-title">SYSTEM ERROR</h1>
                <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.7rem', color: '#ff2a6d', marginBottom: '8px' }}>
                  ★ GAME OVER ★
                </p>

                {/* Tabla de Puntuaciones */}
                <div className="scores-board">
                  <div className="scores-header">TOP HIGH SCORES</div>
                  {highScores.map((item, index) => (
                    <div key={item.id} className={`score-row ${item.nombre === 'TÚ' ? 'current-player' : ''}`}>
                      <span>#{index + 1} {item.nombre}</span>
                      <span>{item.puntaje} PTS</span>
                    </div>
                  ))}
                </div>

                <button className="glitch-retry-btn" onClick={reiniciarJuego}>
                  ► TRY AGAIN
                </button>
              </div>
            )}
          </div>

          <div className="arcade-controls">
            <button className="arcade-btn" onClick={() => setEstado((p) => p === 'playing' ? 'paused' : 'playing')}>
              {estado === 'paused' ? 'REANUDAR' : 'PAUSA'}
            </button>
            <button className="arcade-btn" onClick={reiniciarJuego}>
              REINICIAR
            </button>
          </div>
        </div>
      </div>
    </>
  );
};