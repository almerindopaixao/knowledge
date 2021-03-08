import { Router } from 'express';
import AuthController from '../controllers/Auth';
import UserController from '../controllers/User';

interface CateforyRouterInterface {
  router: Router;
  SignUp: (route: string) => void;
  SignIn: (route: string) => void;
  Validate: (route: string) => void;
}

class AuthRouter implements CateforyRouterInterface {
  public router = Router();

  constructor() {
    this.SignUp('/signup');
    this.SignIn('/signin');
    this.Validate('/validateToken');
  }

  SignUp(route: string) {
    this.router.post(route, UserController.Store);
  }

  SignIn(route: string) {
    this.router.post(route, AuthController.Store);
  }

  Validate(route: string) {
    this.router.post(route, AuthController.Validate);
  }
}

export default new AuthRouter().router;
