import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/reduxStore';
import {
  setGameMode,
  setGameStatus,
  changeDirection,
  setPlayerName,
  startNewGame,
  resetGameState,
} from '../store/gameSlice';
import { controllSnake } from '../utils/snakeMove';

const GameControl = () => {
  const { gameStatus, mode, playerName, score, nextSpeedIncrease } =
    useAppSelector(state => state.game);
  const [inputName, setIntputName] = useState('');
  const [modeRadio, setModeRadio] = useState<'standart' | 'reversive'>(
    'standart'
  );
  const dispatch = useAppDispatch();
  const startGame = () => {
    if (mode !== modeRadio) dispatch(setGameMode(modeRadio));
    if (gameStatus === 'end') {
      dispatch(startNewGame());
    } else {
      dispatch(setGameStatus('active'));
      dispatch(setPlayerName(inputName));
    }
  };

  const pauseGame = () => {
    if (gameStatus === 'active') dispatch(setGameStatus('paused'));
  };

  const resetGame = () => {
    dispatch(resetGameState());
  };

  useEffect(() => {
    const handleDirection = window.addEventListener('keydown', e => {
      const eventReturn = controllSnake(e);

      if (!eventReturn) return;

      if (eventReturn === 'changeGameStatus') {
        switch (gameStatus) {
          case 'active':
            dispatch(setGameStatus('paused'));
            break;
          case 'paused':
            dispatch(setGameStatus('active'));
            break;
          case 'wait':
            dispatch(setGameStatus('active'));
            break;
          case 'end':
            return; //think about restart or leave it like it is
        }
      } else if (gameStatus === 'active') {
        dispatch(changeDirection(eventReturn));
      }
    });

    return () => {
      window.removeEventListener(
        'keydown',
        handleDirection as unknown as EventListener
      );
    };
  }, [gameStatus, dispatch]);

  return (
    <form
      className='flex flex-col space-y-2 mt-5'
      onSubmit={e => e.preventDefault()}
    >
      <h2 className='text-2xl'>Game Controll</h2>
      {playerName ? (
        <>
          <div>Player name: {playerName} </div>
          <div>Score: {score}</div>
          <div>Speed level: {nextSpeedIncrease / 50} </div>
        </>
      ) : (
        <>
          <input
            className='border border-emerald-400 px-3 py-2 rounded-lg'
            type='text'
            placeholder='Please write your name to start game'
            required
            minLength={3}
            value={inputName}
            onChange={e => setIntputName(e.target.value)}
          />
          <div>Choose your game mode</div>
          <fieldset className='space-y-2'>
            <input
              type='radio'
              value='standart'
              name='gameMode'
              id='game-standart'
              checked={true}
              onChange={e => setModeRadio(e.target.value as 'standart')}
            />
            <label htmlFor='game-standart'> Standart game mode</label>
            <br />
            <input
              type='radio'
              value='reversive'
              name='gameMode'
              id='game-reversive'
              onChange={e => setModeRadio(e.target.value as 'reversive')}
            />
            <label htmlFor='game-reversive'>Reversive infinite game mode</label>
          </fieldset>
        </>
      )}
      <button
        className=' ring-2 rounded-xl hover:bg-emerald-200 ring-emerald-300  '
        onClick={() => {
          if (inputName.length < 3) return;
          gameStatus === 'active' ? pauseGame() : startGame();
        }}
      >
        {gameStatus === 'active'
          ? 'Pause'
          : gameStatus === 'end'
          ? 'Start new game'
          : 'Start'}
      </button>
      <button
        onClick={resetGame}
        className=' ring-2 rounded-xl hover:bg-red-200 ring-red-300  '
      >
        Reset game
      </button>
      {/* Game intruction */}
      <p>Use w,a,s,d or &uarr;, &larr;, &darr;, &rarr; to controll snake</p>
      <p>Press ecs, enter or space to pause game</p>
    </form>
  );
};

export default GameControl;
