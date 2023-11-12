import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Pos {
  x: number;
  y: number;
}

export type Move = 'left' | 'right' | 'up' | 'down';
type GameStatus = 'end' | 'active' | 'paused' | 'wait';
type GameMode = 'standart' | 'reversive';
type GameBoard = { width: number; height: number };
export type Food = {
  pos: Pos;
  value: 1 | 5 | 10;
};

interface GameState {
  playerName: string;
  snake: Pos[] | [];
  move: Move;
  disallowedDirection: Move | 'none';
  score: number;
  gameStatus: GameStatus;
  mode: GameMode;
  reversed: boolean;
  speed: number;
  nextSpeedIncrease: number;
  food: Food | null;
  eatenFoodPos: Pos | null;
  gameBoard: GameBoard;
}

// interface MoveActionPayload {
//   x: number;
//   y: number;
//   direction: Move;
// }

const gameState: GameState = {
  playerName: '',
  move: 'right',
  disallowedDirection: 'left',
  snake: [
    { x: 280, y: 300 },
    { x: 260, y: 300 },
    { x: 240, y: 300 },
    { x: 220, y: 300 },
    { x: 200, y: 300 },
  ],
  score: 48,
  gameStatus: 'wait',
  mode: 'standart',
  reversed: false,
  speed: 100,
  nextSpeedIncrease: 50,
  food: null,
  eatenFoodPos: null,
  gameBoard: { width: 500, height: 500 },
};

const gameSlice = createSlice({
  name: 'gameState',
  initialState: gameState,
  reducers: {
    // set new snake move direction
    // setMove(state, action: PayloadAction<MoveActionPayload>) {
    //   if (action.payload.direction !== state.move)
    //     state.move = action.payload.direction;
    //   const newHead: Pos = {
    //     x: state.snake[0].x + action.payload.x,
    //     y: state.snake[0].y + action.payload.y,
    //   };
    //   const newSnake = [newHead, ...state.snake];
    //   newSnake.pop();
    //   state.snake = newSnake;
    // },
    // have to option of game standard and infinite reversive
    setGameMode(state, action: PayloadAction<'standart' | 'reversive'>) {
      state.mode = action.payload;
      if (action.payload === 'standart') {
        state.disallowedDirection = 'left';
      } else {
        state.disallowedDirection = 'none';
      }
    },
    // controll start and pause game
    setGameStatus(state, action: PayloadAction<GameStatus>) {
      if (state.gameStatus === 'end') return;

      state.gameStatus = action.payload;
    },
    // controll snake change direction move
    changeDirection(state, action: PayloadAction<Move>) {
      // is direction can be changed
      if (
        state.mode === 'standart' &&
        state.disallowedDirection === action.payload
      )
        return;
      state.move = action.payload;

      // set new disallowed direction
      if (state.mode === 'standart') {
        switch (action.payload) {
          case 'down':
            state.disallowedDirection = 'up';
            break;
          case 'left':
            state.disallowedDirection = 'right';
            break;
          case 'right':
            state.disallowedDirection = 'left';
            break;
          case 'up':
            state.disallowedDirection = 'down';
        }
      } else {
        state.disallowedDirection === 'none';
      }
    },
    // continuos moving logic
    continueMoveSnake(state) {
      // move only if game active
      if (state.gameStatus !== 'active') return;

      // calculate delta for new snake`s head
      const dPos = () => {
        switch (state.move) {
          case 'up':
            return { dX: 0, dY: -20 };
          case 'down':
            return { dX: 0, dY: 20 };
          case 'left':
            return { dX: -20, dY: 0 };
          case 'right':
            return { dX: 20, dY: 0 };
        }
      };
      const { dX, dY } = dPos();
      const newX = state.snake[0].x + dX;
      const newY = state.snake[0].y + dY;

      // check if snake is in or out of game board
      const newHead: Pos = {
        x: newX === -20 ? 500 : newX === 500 ? 0 : newX,
        y: newY === -20 ? 500 : newY === 500 ? 0 : newY,
      };

      const newSnake = [newHead, ...state.snake];
      // Check snake pos and make it longer if needed
      if (
        state.eatenFoodPos?.x != newSnake[newSnake.length - 1].x &&
        state.eatenFoodPos?.y != newSnake[newSnake.length - 1].y
      ) {
        newSnake.pop();
      } else {
        state.eatenFoodPos = null;
      }

      state.snake = newSnake;
      // increase speed logic
      if (state.score > state.nextSpeedIncrease) {
        state.nextSpeedIncrease += 50;
        state.speed = 100 - (state.nextSpeedIncrease / 50) * 10;
      }
    },
    setFood(state, action: PayloadAction<Food>) {
      if (!state.food) state.food = action.payload;
    },
    // check if food was eated, save it pos for later adding tail to snake
    eatFood(state) {
      if (state.food) {
        state.score += state.food.value;
        state.eatenFoodPos = state.food.pos;
        state.food = null;
      }
    },
    setPlayerName(state, action: PayloadAction<string>) {
      state.playerName = action.payload;
    },
    // for the future adaptive and ability to choose size of board
    setGameBoard(state, action: PayloadAction<GameBoard>) {
      state.gameBoard = action.payload;
    },
    // start again after game over in the same mode and with the same playername
    startNewGame(state) {
      if (state.gameStatus === 'end') {
        state.gameStatus = 'active';
        state.disallowedDirection = gameState.disallowedDirection;
        state.food = gameState.food;
        state.eatenFoodPos = gameState.eatenFoodPos;
        state.move = gameState.move;
        state.nextSpeedIncrease = gameState.nextSpeedIncrease;
        state.score = gameState.score;
        state.snake = gameState.snake;
        state.speed = gameState.speed;
      }
    },
    resetGameState(state) {
      state.gameStatus = 'wait';
      state.disallowedDirection = gameState.disallowedDirection;
      state.food = gameState.food;
      state.eatenFoodPos = gameState.eatenFoodPos;
      state.move = gameState.move;
      state.nextSpeedIncrease = gameState.nextSpeedIncrease;
      state.score = gameState.score;
      state.snake = gameState.snake;
      state.speed = gameState.speed;
      state.playerName = '';
      state.mode = gameState.mode;
      state.reversed = gameState.reversed;
    },
  },
});

export const {
  // setMove,
  setGameMode,
  setGameStatus,
  changeDirection,
  continueMoveSnake,
  eatFood,
  setFood,
  setPlayerName,
  setGameBoard,
  startNewGame,
  resetGameState,
} = gameSlice.actions;

export default gameSlice.reducer;
