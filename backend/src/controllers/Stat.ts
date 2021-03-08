import { Request, Response } from 'express';
import StatModel from '../models/Stat';

class StatController {
  async Index(req: Request, res: Response) {
    try {
      const stats = await StatModel.findOne(
        {},
        {},
        { sort: { createdAt: -1 } },
      );

      const defaultStats = {
        users: 0,
        categories: 0,
        articles: 0,
      };

      return res.status(200).json(stats || defaultStats);
    } catch (err) {
      return res.status(400).json({ errors: ['Unable to load statistics'] });
    }
  }
}

export default new StatController();
