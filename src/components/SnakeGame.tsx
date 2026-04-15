import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Gamepad2, PauseCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const TICK_RATE = 120;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    if (!snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }

      const { x, y } = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
        case 'Escape':
          setIsPaused((p) => !p);
          break;
      }
    },
    [gameOver]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, TICK_RATE);
    return () => clearInterval(interval);
  }, [food, gameOver, isPaused, highScore]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      {/* Score Board */}
      <div className="flex justify-between w-full mb-4 px-4 py-2 bg-zinc-900/80 border border-cyan-500/30 rounded-xl shadow-[0_0_15px_rgba(0,255,255,0.15)] backdrop-blur-sm">
        <div className="flex flex-col">
          <span className="text-xs text-cyan-400/70 uppercase tracking-widest font-orbitron">Score</span>
          <span className="text-5xl text-cyan-400 font-digital glitch drop-shadow-[0_0_15px_rgba(0,255,255,1)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-fuchsia-400/70 uppercase tracking-widest font-orbitron">High Score</span>
          <span className="text-5xl text-fuchsia-400 font-digital glitch drop-shadow-[0_0_15px_rgba(255,0,255,1)]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative p-1 bg-zinc-900/50 rounded-xl border border-zinc-800 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div
          className="relative bg-black/90 border border-zinc-800/50 rounded-lg overflow-hidden"
          style={{
            width: `${GRID_SIZE * 20}px`,
            height: `${GRID_SIZE * 20}px`,
            boxShadow: 'inset 0 0 50px rgba(0,255,255,0.05)',
          }}
        >
          {/* Grid Lines (Optional, subtle) */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Food */}
          <div
            className="absolute rounded-full bg-fuchsia-500 shadow-[0_0_10px_#ff00ff,0_0_20px_#ff00ff]"
            style={{
              width: '18px',
              height: '18px',
              left: `${food.x * 20 + 1}px`,
              top: `${food.y * 20 + 1}px`,
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute rounded-sm ${
                  isHead
                    ? 'bg-cyan-300 shadow-[0_0_15px_#00ffff,0_0_25px_#00ffff] z-10'
                    : 'bg-cyan-500/80 shadow-[0_0_10px_rgba(0,255,255,0.5)]'
                }`}
                style={{
                  width: '18px',
                  height: '18px',
                  left: `${segment.x * 20 + 1}px`,
                  top: `${segment.y * 20 + 1}px`,
                }}
              />
            );
          })}

          {/* Overlays */}
          {gameOver && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
              <h2 className="text-6xl font-digital text-orange-500 mb-2 uppercase tracking-widest glitch drop-shadow-[0_0_15px_rgba(255,165,0,0.8)]">
                Game Over
              </h2>
              <p className="text-zinc-400 mb-6 font-orbitron text-sm">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-full font-orbitron uppercase tracking-wider hover:bg-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all"
              >
                Play Again
              </button>
            </div>
          )}

          {isPaused && !gameOver && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-cyan-400 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">
                Paused
              </h2>
            </div>
          )}
        </div>
      </div>

      {/* Controls Hint */}
      <div className="mt-6 flex gap-8 text-sm font-orbitron text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
            <Gamepad2 className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
          </div>
          <span className="tracking-widest uppercase text-cyan-100">Move</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center p-2 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(255,0,255,0.3)]">
            <PauseCircle className="w-5 h-5 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]" />
          </div>
          <span className="tracking-widest uppercase text-fuchsia-100">Pause</span>
        </div>
      </div>
    </div>
  );
}
