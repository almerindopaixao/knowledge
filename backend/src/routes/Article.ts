import { Router } from 'express';
import ArticleController from '../controllers/Article';
import admin from '../middlewares/Admin';

interface ArticleInterface {
  router: Router;
  Post: (route: string) => void;
  Put: (route: string) => void;
  Delete: (route: string) => void;
  Get: (route: string) => void;
  GetById: (route: string) => void;
}

class ArticleRouter implements ArticleInterface {
  public router = Router();

  constructor() {
    this.Get('/articles');
    this.Post('/articles');
    this.Put('/articles/:id');
    this.Delete('/articles/:id');
    this.GetById('/articles/:id');
    this.GetByCategory('/categories/:id/articles');
  }

  Post(route: string) {
    this.router.post(route, admin(ArticleController.Store));
  }

  Put(route: string) {
    this.router.put(route, admin(ArticleController.Update));
  }

  Delete(route: string) {
    this.router.delete(route, admin(ArticleController.Destroy));
  }

  Get(route: string) {
    this.router.get(route, admin(ArticleController.Index));
  }

  GetById(route: string) {
    this.router.get(route, ArticleController.Show);
  }

  GetByCategory(route: string) {
    this.router.get(route, ArticleController.IndexCategories);
  }
}

export default new ArticleRouter().router;
