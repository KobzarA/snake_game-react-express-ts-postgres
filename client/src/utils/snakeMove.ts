import { Move } from '../store/gameSlice';

const controllSnake = (
  e: KeyboardEvent
): Move | 'changeGameStatus' | undefined => {
  switch (e.key) {
    case 'ArrowUp':
      return 'up';
    case 'ArrowDown':
      return 'down';
    case 'ArrowLeft':
      return 'left';
    case 'ArrowRight':
      return 'right';
    case 'w':
      return 'up';
    case 's':
      return 'down';
    case 'a':
      return 'left';
    case 'd':
      return 'right';
    case 'Enter':
    case ' ':
    case 'Escape':
      console.log(e.key);
      return 'changeGameStatus';
    default:
      return;
  }
};

const continueMove = (
  direction: Move
): { x: number; y: number; direction: Move } => {
  switch (direction) {
    case 'up':
      return { x: 0, y: -20, direction: 'up' };
    case 'down':
      return { x: 0, y: 20, direction: 'down' };
    case 'left':
      return { x: -20, y: 0, direction: 'left' };
    case 'right':
      return { x: 20, y: 0, direction: 'right' };
    default:
      return { x: 0, y: 0, direction: 'right' };
  }
};

export { controllSnake, continueMove };
