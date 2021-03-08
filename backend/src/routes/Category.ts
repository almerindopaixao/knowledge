import { Router } from 'express';
import CategoryController from '../controllers/Category';
import admin from '../middlewares/Admin';

interface CateforyRouterInterface {
  router: Router;
  Post: (route: string) => void;
  Put: (route: string) => void;
  // Get: (route: string) => void;
}

class CategoryRouter implements CateforyRouterInterface {
  public router = Router();

  constructor() {
    this.Post('/categories');
    this.Get('/categories');
    this.GetTree('/categories/tree');
    this.Put('/categories/:id');
    this.Delete('/categories/:id');
    this.GetById('/categories/:id');
  }

  Post(route: string) {
    this.router.post(route, admin(CategoryController.Store));
  }

  Put(route: string) {
    this.router.put(route, admin(CategoryController.Update));
  }

  Delete(route: string) {
    this.router.delete(route, admin(CategoryController.Destroy));
  }

  Get(route: string) {
    this.router.get(route, admin(CategoryController.Index));
  }

  GetTree(route: string) {
    this.router.get(route, CategoryController.IndexTree);
  }

  GetById(route: string) {
    this.router.get(route, CategoryController.Show);
  }
}

export default new CategoryRouter().router;
