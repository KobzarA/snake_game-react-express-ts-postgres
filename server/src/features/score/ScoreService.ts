export type Score = { name: string; score: number };
import { Score } from './score.model';

class ScoreService {
  static async getScore() {
    const res = await Score.findAndCountAll({
      order: [['score', 'DESC']],
      limit: 20,
    });

    return res.rows;
  }

  static async createScore({ name, score }: Score) {
    const res = await (await Score.create({ name, score })).save();
    return res;
  }
}

export default ScoreService;
