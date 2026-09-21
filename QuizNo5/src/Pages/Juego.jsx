import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tablero } from '../Components/Tablero';
import { Marcador } from '../Components/Marcador';
import { Menu } from '../Components/Menu';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIR = { x: 0, y: -1 };
const INITIAL_FOOD = { x: 5, y: 5 };

export const Juego = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [estado, setEstado] = useState('idle'); // idle | playing | paused | gameover
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [directionDisplay, setDirectionDisplay] = useState(INITIAL_DIR);

  // Referencias mutables para evitar cierres obsoletos (stale closures) en el interval de React
  const dirRef = useRef(INITIAL_DIR);
  const foodRef = useRef(INITIAL_FOOD);

  // Mantener foodRef sincronizado con el estado de la comida
  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  const cambiarDireccion = useCallback((nuevaDir) => {
    const actual = dirRef.current;
    // Evitar rotación inversa sobre el propio cuerpo de la serpiente
    if (nuevaDir.x !== 0 && actual.x === 0) {
      dirRef.current = nuevaDir;
      setDirectionDisplay(nuevaDir);
    }
    if (nuevaDir.y !== 0 && actual.y === 0) {
      dirRef.current = nuevaDir;
      setDirectionDisplay(nuevaDir);
    }

    // Auto-iniciar la partida al interactuar
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

  // Bucle principal de juego (Game Loop)
  useEffect(() => {
    if (estado !== 'playing') return;

    const velocidad = Math.max(70, 150 - Math.floor(puntos / 50) * 15);

    const timer = setInterval(() => {
      setSnake((prevSnake) => {
        const dir = dirRef.current;
        const head = prevSnake[0];
        const nextHead = { x: head.x + dir.x, y: head.y + dir.y };

        // Colisión con paredes
        if (
          nextHead.x < 0 ||
          nextHead.x >= GRID_SIZE ||
          nextHead.y < 0 ||
          nextHead.y >= GRID_SIZE
        ) {
          manejarPerdidaVida();
          return prevSnake;
        }

        // Colisión con el propio cuerpo
        if (prevSnake.some((seg) => seg.x === nextHead.x && seg.y === nextHead.y)) {
          manejarPerdidaVida();
          return prevSnake;
        }

        // Detección de comida
        const estaComiendo = nextHead.x === foodRef.current.x && nextHead.y === foodRef.current.y;

        if (estaComiendo) {
          setPuntos((p) => p + 10);

          const nuevaSerpiente = [nextHead, ...prevSnake];

          // Generar nueva comida fuera de la serpiente
          let nuevaComida;
          do {
            nuevaComida = {
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE),
            };
          } while (nuevaSerpiente.some((s) => s.x === nuevaComida.x && s.y === nuevaComida.y));

          foodRef.current = nuevaComida;
          setFood(nuevaComida);

          return nuevaSerpiente;
        }

        // Movimiento normal
        return [nextHead, ...prevSnake.slice(0, -1)];
      });
    }, velocidad);

    return () => clearInterval(timer);
  }, [estado, puntos]);

  const manejarPerdidaVida = () => {
    setVidas((v) => {
      if (v - 1 <= 0) {
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
    setPuntos(0);
    setVidas(3);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
      {/* Fondo con burbujas animadas */}
      <div className="bg-bubbles">
        <div className="bg-bubble" style={{ width: '60px', height: '60px', left: '10%', animationDuration: '8s' }}></div>
        <div className="bg-bubble" style={{ width: '40px', height: '40px', left: '80%', animationDuration: '12s', animationDelay: '2s' }}></div>
        <div className="bg-bubble" style={{ width: '80px', height: '80px', left: '50%', animationDuration: '10s', animationDelay: '4s' }}></div>
      </div>

      <Marcador puntos={puntos} vidas={vidas} nivel={Math.floor(puntos / 50) + 1} />

      <div style={{ position: 'relative' }}>
        <Tablero snake={snake} food={food} direction={directionDisplay} />

        {/* Superposición de estado (Idle, Pausa, Game Over) */}
        {estado !== 'playing' && (
          <div
            className="glass-panel"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '25px',
              textAlign: 'center',
              width: '80%',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            {estado === 'idle' && (
              <>
                <h3 style={{ color: '#00e5ff', fontSize: '1.4rem', marginBottom: '10px' }}>🐍 ¿LISTO PARA NAVEGAR?</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>Presiona <strong>▶ JUGAR</strong> o toca cualquier flecha del teclado.</p>
                <button className="btn-y2k" onClick={() => setEstado('playing')}>▶ EMPEZAR YA</button>
              </>
            )}

            {estado === 'paused' && (
              <>
                <h3 style={{ color: '#fff5b8', fontSize: '1.4rem', marginBottom: '10px' }}>⏸ PAUSA ACUÁTICA</h3>
                <button className="btn-y2k" onClick={() => setEstado('playing')}>▶ REANUDAR</button>
              </>
            )}

            {estado === 'gameover' && (
              <>
                <h3 style={{ color: '#ff8fd1', fontSize: '1.5rem', marginBottom: '10px' }}>💥 ¡FIN DE LA PARTIDA!</h3>
                <p style={{ marginBottom: '15px' }}>Puntaje final: <strong>{puntos} pts</strong></p>
                <button className="btn-y2k pink" onClick={reiniciarJuego}>🔄 INTENTAR DE NUEVO</button>
              </>
            )}
          </div>
        )}
      </div>

      <Menu
        estado={estado}
        iniciar={() => setEstado('playing')}
        pausar={() => setEstado('paused')}
        reiniciar={reiniciarJuego}
      />

      {/* D-Pad Estilo Consola Y2K */}
      <div className="dpad-container" style={{ marginTop: '15px' }}>
        <button className="btn-y2k dpad-btn" onClick={() => cambiarDireccion({ x: 0, y: -1 })}>▲</button>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn-y2k dpad-btn" onClick={() => cambiarDireccion({ x: -1, y: 0 })}>◄</button>
          <button className="btn-y2k dpad-btn" onClick={() => cambiarDireccion({ x: 0, y: 1 })}>▼</button>
          <button className="btn-y2k dpad-btn" onClick={() => cambiarDireccion({ x: 1, y: 0 })}>►</button>
        </div>
      </div>
    </div>
  );
};