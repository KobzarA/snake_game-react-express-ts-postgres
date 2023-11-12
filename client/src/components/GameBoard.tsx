import { useRef, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/reduxStore';
import { clearBoard, drawObject, generateRandomPosition } from '../utils/draw';
import {
  continueMoveSnake,
  eatFood,
  setFood,
  setGameBoard,
  setGameStatus,
  startNewGame,
} from '../store/gameSlice';
import { useSaveScoreMutation } from '../store/scoreApi';

interface PGameBoard {
  width?: number;
  height?: number;
}

const GameBoard = ({ width, height }: PGameBoard) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const { snake, gameStatus, speed, food, gameBoard, playerName, score, mode } =
    useAppSelector(state => state.game);
  const dispach = useAppDispatch();
  const [saveScore, result] = useSaveScoreMutation();

  if (
    width &&
    height &&
    (width !== gameBoard.width || height !== gameBoard.height)
  ) {
    dispach(setGameBoard({ width, height }));
  }

  const animateGame = () => {
    setContext(canvasRef.current ? canvasRef.current.getContext('2d') : null);
    clearBoard(context, gameBoard.width, gameBoard.height);
    drawObject(context, snake, '#676FA3');

    const isGameOver = () => {
      if (mode === 'reversive') return;
      if (
        snake.some((value, i) => {
          return value.x === snake[0].x && value.y === snake[0].y && i !== 0;
        })
      ) {
        dispach(setGameStatus('end'));
        saveScore({ score, name: playerName });
      }
    };

    isGameOver();

    if (!food) {
      let newFoodPos = generateRandomPosition(
        gameBoard.width - 20,
        gameBoard.height - 20
      );
      const checkFoodPos = () => {
        if (
          snake.some(value => {
            return value.x === newFoodPos.pos.x && value.y === newFoodPos.pos.y;
          })
        ) {
          newFoodPos = generateRandomPosition(
            gameBoard.width - 20,
            gameBoard.height - 20
          );
          checkFoodPos();
        } else return;
      };

      checkFoodPos();

      dispach(setFood(newFoodPos));
    }

    if (gameStatus === 'active' && food) {
      const foodColor = () => {
        switch (food.value) {
          case 1:
            return '#2AAA8A';
          case 5:
            return '#FF1493';
          case 10:
            return '#FFD700';
        }
      };
      drawObject(context, [food.pos], foodColor());
    }
    if (snake[0].x === food?.pos.x && snake[0].y === food?.pos.y)
      dispach(eatFood());
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameStatus === 'active') {
      interval = setInterval(() => {
        dispach(continueMoveSnake());

        animateGame();
      }, speed * 2);
    }

    return () => {
      clearInterval(interval);
    };
  }, [gameStatus, snake, speed]);

  return (
    <div className='relative'>
      <canvas
        ref={canvasRef}
        width={gameBoard.width}
        height={gameBoard.height}
        className={`border-2 border-solid border-blue-900 mx-auto mt-5 `}
      ></canvas>
      {gameStatus === 'end' ? (
        <div className='absolute text-center top-[15%] left-1/3 w-1/3 h-2/3 border rounded-md p-4 bg-slate-300  '>
          <h2 className='mb-2'>Game over</h2>
          <div className='mb-2'>
            {playerName} your score is <br />
            <em>{score}</em>
          </div>
          <p>Want to try again?</p>
          <button
            disabled={result.isLoading}
            onClick={() => {
              dispach(startNewGame());
            }}
            className=' ring-2 rounded-xl hover:bg-emerald-200 ring-emerald-300  px-4 mt-2'
          >
            Yes
          </button>
          <p>
            {result.isSuccess
              ? 'Your score was saved'
              : result.isError
              ? 'Problems while saving your score...'
              : null}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default GameBoard;
