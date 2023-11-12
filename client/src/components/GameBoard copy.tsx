import { RefObject, useRef, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/reduxStore';
import { clearBoard, drawObject, generateRandomPosition } from '../utils/draw';
import {
  continueMoveSnake,
  eatFood,
  setFood,
  setGameBoard,
  setGameStatus,
} from '../store/gameSlice';

interface PGameBoard {
  width?: number;
  height?: number;
}
type AnimationFrameRef = RefObject<(timestamp: number) => void>;

const GameBoardCopy = ({ width, height }: PGameBoard) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animateRef = useRef<AnimationFrameRef>();
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const { snake, gameStatus, food, gameBoard, playerName, score, mode } =
    useAppSelector(state => state.game);
  const dispach = useAppDispatch();

  if (
    width &&
    height &&
    (width !== gameBoard.width || height !== gameBoard.height)
  ) {
    dispach(setGameBoard({ width, height }));
  }

  const animateGame = () => {
    dispach(continueMoveSnake());

    setContext(canvasRef.current ? canvasRef.current.getContext('2d') : null);
    clearBoard(context, gameBoard.width, gameBoard.height);
    drawObject(context, snake, '#676FA3');

    const isGameOver = () => {
      if (mode === 'reversive') return;
      if (
        snake.some((value, i) => {
          return value.x === snake[0].x && value.y === snake[0].y && i !== 0;
        })
      )
        dispach(setGameStatus('end'));
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    animateRef.current = window.requestAnimationFrame(animateGame);
    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.cancelAnimationFrame(animateRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='relative'>
      <canvas
        ref={canvasRef}
        width={gameBoard.width}
        height={gameBoard.height}
        className={`border-2 border-solid border-blue-900 mx-auto mt-5 `}
      ></canvas>
      {gameStatus === 'end' ? (
        <div className='absolute top-[15%] left-1/3 w-1/3 h-2/3 border rounded-md p-4 bg-slate-300  '>
          <h2>Game over</h2>
          <div>
            {playerName} your score is {score}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default GameBoardCopy;
