import { useGetTop20ScoresQuery } from '../store/scoreApi';

const HightScore = () => {
  const { data, isLoading, isError } = useGetTop20ScoresQuery();
  const topScores = data
    ? data.map(item => {
        return (
          <li className='flex justify-between w-40'>
            <div className='w-8/12'>{item.name}</div>
            <div className='w-3/12'>{item.score}</div>
          </li>
        );
      })
    : null;

  return (
    <div className='mt-5'>
      <h2 className='text-2xl'>Top 20 highest scores</h2>

      <ul className='mt-2'>
        <li className='flex justify-between w-40'>
          <div className='w-8/12'>Name</div>
          <div className='w-3/12'>Score</div>
        </li>
        {isLoading ? <li>Loading...</li> : null}
        {isError ? <li>Error while loading top scores.</li> : null}
        {topScores}
      </ul>
    </div>
  );
};

export default HightScore;
