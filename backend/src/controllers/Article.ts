import { Request, Response } from 'express';
import articleModel from '../models/Article';

interface ArticleParams {
  name?: string;
  description?: string;
  imageUrl?: string;
  content?: string;
  userId?: number;
  categoryId?: number;
}

class ArticleController {
  async Index(req: Request, res: Response) {
    const page = req.query.page || 1;

    const result = await articleModel.get(Number(page));

    if (articleModel.errors.length > 0) {
      return res.status(articleModel.status).json({
        errors: articleModel.errors,
      });
    }

    if (result !== undefined)
      return res.status(articleModel.status).json(result);
  }

  async IndexCategories(req: Request, res: Response) {
    const categoryId = req.params.id;
    const page = req.query.page || 1;

    if (isNaN(Number(categoryId))) {
      return res.status(400).json({
        errors: ['Param id must be an integer'],
      });
    }

    const articles = await articleModel.getByCategory(
      Number(categoryId),
      Number(page),
    );

    if (articleModel.errors.length > 0) {
      return res.status(articleModel.status).json({
        errors: articleModel.errors,
      });
    }

    if (articles !== undefined)
      return res.status(articleModel.status).json(articles);
  }

  async Show(req: Request, res: Response) {
    const articleId: string = req.params.id;

    if (isNaN(Number(articleId))) {
      return res.status(400).json({
        errors: ['Param id must be an integer'],
      });
    }

    const article = await articleModel.getById(Number(articleId));

    if (articleModel.errors.length > 0) {
      return res.status(articleModel.status).json({
        errors: articleModel.errors,
      });
    }

    return res
      .status(articleModel.status)
      .json({ ...article, content: article?.content.toString() });
  }

  async Store(req: Request, res: Response) {
    const article: ArticleParams = { ...req.body };

    await articleModel.register(article);

    if (articleModel.errors.length > 0) {
      return res.status(articleModel.status).json({
        errors: articleModel.errors,
      });
    }

    return res.status(articleModel.status).json({
      success: 'Article successfully registered',
    });
  }

  async Update(req: Request, res: Response) {
    const article: ArticleParams = { ...req.body };
    const articleId: string = req.params.id;

    if (isNaN(Number(articleId))) {
      return res.status(400).json({
        errors: ['Param id must be an integer'],
      });
    }

    await articleModel.edit({ ...article, id: Number(articleId) });

    if (articleModel.errors.length > 0) {
      return res.status(articleModel.status).json({
        errors: articleModel.errors,
      });
    }

    return res.status(articleModel.status).json({
      success: 'Article successfully edited',
    });
  }

  async Destroy(req: Request, res: Response) {
    const articleId: string = req.params.id;

    if (isNaN(Number(articleId))) {
      return res.status(400).json({
        errors: ['Param id must be an integer'],
      });
    }

    await articleModel.remove(Number(articleId));

    if (articleModel.errors.length > 0) {
      return res.status(articleModel.status).json({
        errors: articleModel.errors,
      });
    }

    return res.status(articleModel.status).json({
      success: 'Article successfully removed',
    });
  }
}

export default new ArticleController();
