import { Router } from 'express';
import StatController from '../controllers/Stat';

interface StatRouterInterface {
  router: Router;
  Get: (route: string) => void;
}

class StatRouter implements StatRouterInterface {
  public router = Router();

  constructor() {
    this.Get('/stats');
  }

  Get(route: string) {
    this.router.get(route, StatController.Index);
  }
}

export default new StatRouter().router;
