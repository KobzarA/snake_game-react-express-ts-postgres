import { Router } from 'express';
import ScoreService from './ScoreService';

const scoreRouter = Router();

scoreRouter.get('/', async (req, res) => {
  try {
    const topScore = await ScoreService.getScore();
    return res.status(200).json(topScore);
  } catch (error) {
    return res.status(500);
  }
});

scoreRouter.post('/', async (req, res) => {
  // Check req.body data
  if (
    req.body &&
    typeof req.body.name === 'string' &&
    typeof req.body.score === 'number'
  ) {
    try {
      const topScore = await ScoreService.createScore(req.body);
      return res.status(201).json({
        success: true,
        data: topScore,
        message: 'Score saved succesfully',
      });
    } catch (error) {}
    return;
  } else {
    return res
      .status(400)
      .json({ success: true, data: null, message: 'Wrong data recieved' });
  }
});

export default scoreRouter;
