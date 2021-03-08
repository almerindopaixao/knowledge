import { Router } from 'express';
import UserController from '../controllers/User';
import admin from '../middlewares/Admin';

interface UserRouterInterface {
  router: Router;
  Post: (route: string) => void;
  Put: (route: string) => void;
  Get: (route: string) => void;
  Delete: (route: string) => void;
}

class UserRouter implements UserRouterInterface {
  public router = Router();

  constructor() {
    this.Get('/users');
    this.Post('/users');
    this.GetById('/users/:id');
    this.Put('/users/:id');
    this.Delete('/users/:id');
  }

  Post(route: string) {
    this.router.post(route, admin(UserController.Store));
  }

  Put(route: string) {
    this.router.put(route, admin(UserController.Update));
  }

  Delete(route: string) {
    this.router.delete(route, admin(UserController.Destroy));
  }

  Get(route: string) {
    this.router.get(route, admin(UserController.Index));
  }

  GetById(route: string) {
    this.router.get(route, admin(UserController.Show));
  }
}

export default new UserRouter().router;
