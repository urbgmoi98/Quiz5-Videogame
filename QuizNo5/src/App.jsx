import { useState, useEffect } from 'react';
import './App.css';

// Configuración del tablero
const BOARD_SIZE = 20; // 20x20 cuadros
const CELL_SIZE = 20;  // Cada cuadro mide 20x20 píxeles
const INITIAL_SPEED = 200; // Milisegundos entre cada movimiento (menor = más rápido)

function App() {
  // 1. ESTADOS DEL JUEGO
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]); // La serpiente empieza en el centro
  const [food, setFood] = useState({ x: 15, y: 5 });      // La comida empieza en una esquina
  const [direction, setDirection] = useState('RIGHT');     // Dirección inicial
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // 2. CONTROLES DE TECLADO
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Evitamos que la serpiente se devuelva sobre sí misma (causa bug visual)
      if (e.key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP');
      if (e.key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN');
      if (e.key === 'ArrowLeft' && direction !== 'RIGHT') setDirection('LEFT');
      if (e.key === 'ArrowRight' && direction !== 'LEFT') setDirection('RIGHT');
      
      // Reiniciar si presiona Enter al perder
      if (e.key === 'Enter' && gameOver) resetGame();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  // 3. CICLO DEL JUEGO (GAME LOOP)
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, INITIAL_SPEED);

    // Limpiamos el intervalo cuando el componente se desmonta o el estado cambia
    return () => clearInterval(interval);
  }, [snake, gameOver]); 

  // 4. LÓGICA DE MOVIMIENTO
  const moveSnake = () => {
    const head = snake[0];
    let newHead = { ...head };

    // Calculamos la nueva posición de la cabeza
    if (direction === 'UP') newHead.y -= 1;
    if (direction === 'DOWN') newHead.y += 1;
    if (direction === 'LEFT') newHead.x -= 1;
    if (direction === 'RIGHT') newHead.x += 1;

    // Detectar colisión con las paredes
    if (newHead.x < 0 || newHead.x >= BOARD_SIZE || newHead.y < 0 || newHead.y >= BOARD_SIZE) {
      setGameOver(true);
      return;
    }

    // Detectar colisión consigo misma
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    // Creamos la nueva serpiente (añadiendo la nueva cabeza al inicio)
    const newSnake = [newHead, ...snake];

    // Detectar si comió
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(score + 10);
      generateNewFood(newSnake); // Si comió, NO quitamos la cola (crece) y generamos nueva comida
    } else {
      newSnake.pop(); // Si no comió, quitamos la cola para mantener el tamaño
    }

    setSnake(newSnake);
  };

  // Generar comida en un lugar aleatorio (que no esté sobre la serpiente)
  const generateNewFood = (currentSnake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      };
    } while (currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
    
    setFood(newFood);
  };

  // Reiniciar el juego
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 5 });
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
  };

  // 5. RENDERIZADO (LO QUE VES EN PANTALLA)
  return (
    <div className="game-container">
      <h1>Snake Game 🐍</h1>
      <p>Puntaje: {score}</p>
      
      {/* El Tablero */}
      <div 
        className="board" 
        style={{ 
          width: BOARD_SIZE * CELL_SIZE, 
          height: BOARD_SIZE * CELL_SIZE 
        }}
      >
        {/* Dibujar la comida */}
        <div 
          className="food" 
          style={{ 
            left: food.x * CELL_SIZE, 
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE
          }} 
        />

        {/* Dibujar la serpiente */}
        {snake.map((segment, index) => (
          <div 
            key={index} 
            className={`snake-segment ${index === 0 ? 'head' : ''}`}
            style={{ 
              left: segment.x * CELL_SIZE, 
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE
            }} 
          />
        ))}

        {/* Pantalla de Game Over */}
        {gameOver && (
          <div className="game-over">
            <h2>¡Perdiste!</h2>
            <p>Puntaje final: {score}</p>
            <button onClick={resetGame}>Jugar de nuevo</button>
          </div>
        )}
      </div>
      
      <p className="instructions">Usa las flechas del teclado para moverte</p>
    </div>
  );
}

export default App;