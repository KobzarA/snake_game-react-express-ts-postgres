import GameBoard from './components/GameBoard';
import HightScore from './components/HightScore';
import GameControl from './components/GameControl';
// import GameBoardCopy from './components/GameBoard copy';

function App() {
  return (
    <main className='container mx-auto flex flex-wrap justify-around space-x-6  '>
      <h1 className='mt-5 text-center font-mono text-3xl w-full '>
        Snake game
      </h1>
      <HightScore />
      <GameBoard
        width={500}
        height={500}
      />
      {/* <GameBoardCopy
        width={500}
        height={500}
      /> */}
      <GameControl />
    </main>
  );
}

export default App;
