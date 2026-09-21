import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tablero } from '../Components/Tablero';
import { Marcador } from '../Components/Marcador';
import { Menu } from '../Components/Menu';
import { sound } from '../Utils/sound';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
];
const INITIAL_DIR = { x: 0, y: -1 };
const INITIAL_FOOD = { x: 5, y: 5 };

const POWERUP_TYPES = [
  { type: 'speed', icon: '⚡', label: 'TURBO', duration: 5 },
  { type: 'slow', icon: '🐢', label: 'LENTO', duration: 6 },
  { type: 'star', icon: '⭐', label: 'PUNTOS X2', duration: 7 },
  { type: 'shrink', icon: '💎', label: 'CORTE COLA', duration: 0 },
];

export const Juego = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [powerup, setPowerup] = useState(null);
  const [obstacles, setObstacles] = useState([]);
  const [activePowerUp, setActivePowerUp] = useState(null);

  const [estado, setEstado] = useState('idle'); // idle | playing | paused | gameover
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [directionDisplay, setDirectionDisplay] = useState(INITIAL_DIR);

  const dirRef = useRef(INITIAL_DIR);
  const foodRef = useRef(INITIAL_FOOD);
  const powerupRef = useRef(null);
  const activePowerUpRef = useRef(null);

  // Calcular Nivel según el Puntaje (Dificultad Progresiva)
  const nivel = Math.floor(puntos / 40) + 1;

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    powerupRef.current = powerup;
  }, [powerup]);

  // Generar obstáculos según el nivel alcanzado
  useEffect(() => {
    if (nivel > 1) {
      const newObs = [];
      const count = Math.min((nivel - 1) * 2, 8);
      for (let i = 0; i < count; i++) {
        newObs.push({
          x: (i * 3 + 2) % (GRID_SIZE - 2) + 1,
          y: (i * 4 + 3) % (GRID_SIZE - 2) + 1,
        });
      }
      setObstacles(newObs);
      sound.playLevelUp();
    } else {
      setObstacles([]);
    }
  }, [nivel]);

  // Manejar tiempo restante de Power-Ups
  useEffect(() => {
    if (!activePowerUp) return;
    activePowerUpRef.current = activePowerUp;

    if (activePowerUp.duration > 0) {
      const timer = setInterval(() => {
        setActivePowerUp((prev) => {
          if (!prev || prev.duration <= 1) {
            activePowerUpRef.current = null;
            return null;
          }
          const updated = { ...prev, duration: prev.duration - 1 };
          activePowerUpRef.current = updated;
          return updated;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activePowerUp]);

  const cambiarDireccion = useCallback((nuevaDir) => {
    const actual = dirRef.current;
    if (nuevaDir.x !== 0 && actual.x === 0) {
      dirRef.current = nuevaDir;
      setDirectionDisplay(nuevaDir);
    }
    if (nuevaDir.y !== 0 && actual.y === 0) {
      dirRef.current = nuevaDir;
      setDirectionDisplay(nuevaDir);
    }
    setEstado((prev) => (prev === 'idle' ? 'playing' : prev));
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
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
    },
    [cambiarDireccion]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Bucle Principal de Juego
  useEffect(() => {
    if (estado !== 'playing') return;

    // Ajuste dinámico de velocidad según nivel y power-ups activos
    let baseSpeed = Math.max(50, 140 - (nivel - 1) * 15);
    if (activePowerUpRef.current?.type === 'speed') baseSpeed = Math.max(35, baseSpeed - 40);
    if (activePowerUpRef.current?.type === 'slow') baseSpeed += 50;

    const timer = setInterval(() => {
      setSnake((prevSnake) => {
        const dir = dirRef.current;
        const head = prevSnake[0];
        const nextHead = { x: head.x + dir.x, y: head.y + dir.y };

        // Colisión BORDES
        if (
          nextHead.x < 0 ||
          nextHead.x >= GRID_SIZE ||
          nextHead.y < 0 ||
          nextHead.y >= GRID_SIZE
        ) {
          sound.playHit();
          manejarPerdidaVida();
          return prevSnake;
        }

        // Colisión CUERPO u OBSTÁCULOS
        const choqueCuerpo = prevSnake.some((seg) => seg.x === nextHead.x && seg.y === nextHead.y);
        const choqueObstaculo = obstacles.some((obs) => obs.x === nextHead.x && obs.y === nextHead.y);

        if (choqueCuerpo || choqueObstaculo) {
          sound.playHit();
          manejarPerdidaVida();
          return prevSnake;
        }

        let nuevaSerpiente = [nextHead, ...prevSnake];

        // Comer COMIDA NORMAL
        if (nextHead.x === foodRef.current.x && nextHead.y === foodRef.current.y) {
          sound.playEat();
          const multiplicador = activePowerUpRef.current?.type === 'star' ? 2 : 1;
          setPuntos((p) => p + 10 * multiplicador);

          // Generar Comida
          let nuevaComida;
          do {
            nuevaComida = {
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE),
            };
          } while (nuevaSerpiente.some((s) => s.x === nuevaComida.x && s.y === nuevaComida.y));
          foodRef.current = nuevaComida;
          setFood(nuevaComida);

          // Probabilidad de spawn de Power-Up (25%)
          if (!powerupRef.current && Math.random() < 0.25) {
            const pItem = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
            const pos = {
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE),
              ...pItem,
            };
            powerupRef.current = pos;
            setPowerup(pos);
          }
        } else {
          nuevaSerpiente.pop();
        }

        // Comer POWER-UP
        if (powerupRef.current && nextHead.x === powerupRef.current.x && nextHead.y === powerupRef.current.y) {
          sound.playPowerUp();
          const pType = powerupRef.current;

          if (pType.type === 'shrink') {
            nuevaSerpiente = nuevaSerpiente.slice(0, Math.max(2, nuevaSerpiente.length - 2));
          } else {
            setActivePowerUp(pType);
          }

          powerupRef.current = null;
          setPowerup(null);
        }

        return nuevaSerpiente;
      });
    }, baseSpeed);

    return () => clearInterval(timer);
  }, [estado, nivel, obstacles]);

  const manejarPerdidaVida = () => {
    setVidas((v) => {
      if (v - 1 <= 0) {
        sound.playGameOver();
        setEstado('gameover');
        return 0;
      }
      setEstado('paused');
      dirRef.current = INITIAL_DIR;
      setDirectionDisplay(INITIAL_DIR);
      setSnake(INITIAL_SNAKE);
      return v - 1;
    });
  };

  const reiniciarJuego = () => {
    setEstado('idle');
    setSnake(INITIAL_SNAKE);
    dirRef.current = INITIAL_DIR;
    setDirectionDisplay(INITIAL_DIR);
    setFood(INITIAL_FOOD);
    foodRef.current = INITIAL_FOOD;
    setPowerup(null);
    powerupRef.current = null;
    setActivePowerUp(null);
    setPuntos(0);
    setVidas(3);
  };

  return (
    <div className="app-container fade-in">
      {/* Burbujas dinámicas */}
      <div className="bg-bubbles">
        <div className="bg-bubble" style={{ width: '50px', height: '50px', left: '15%', animationDuration: '8s' }}></div>
        <div className="bg-bubble" style={{ width: '70px', height: '70px', left: '75%', animationDuration: '11s', animationDelay: '2s' }}></div>
      </div>

      <Marcador puntos={puntos} vidas={vidas} nivel={nivel} activePowerUp={activePowerUp} />

      <Tablero
        snake={snake}
        food={food}
        powerup={powerup}
        obstacles={obstacles}
        direction={directionDisplay}
        estado={estado}
        puntos={puntos}
        nivel={nivel}
        reiniciar={reiniciarJuego}
      />

      <Menu
        estado={estado}
        iniciar={() => setEstado('playing')}
        pausar={() => setEstado('paused')}
        reiniciar={reiniciarJuego}
      />

      {/* D-Pad táctil */}
      <div className="dpad-container">
        <button className="btn-y2k dpad-btn" onClick={() => cambiarDireccion({ x: 0, y: -1 })}>▲</button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-y2k dpad-btn" onClick={() => cambiarDireccion({ x: -1, y: 0 })}>◄</button>
          <button className="btn-y2k dpad-btn" onClick={() => cambiarDireccion({ x: 0, y: 1 })}>▼</button>
          <button className="btn-y2k dpad-btn" onClick={() => cambiarDireccion({ x: 1, y: 0 })}>►</button>
        </div>
      </div>
    </div>
  );
};