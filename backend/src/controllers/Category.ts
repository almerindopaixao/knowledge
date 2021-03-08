import { Request, Response } from 'express';
import categoryModel from '../models/Category';
import withPath from '../utils/withPath';
import toTree from '../utils/toTree';

interface CategoryParams {
  name?: string;
  parentId: number;
}

class CategoryController {
  async Index(req: Request, res: Response) {
    const categories = await categoryModel.get();

    if (categoryModel.errors.length > 0) {
      return res.status(categoryModel.status).json({
        errors: categoryModel.errors,
      });
    }

    if (categories !== undefined)
      return res.status(categoryModel.status).json(withPath(categories));
  }

  async IndexTree(req: Request, res: Response) {
    const categories = await categoryModel.get();

    if (categoryModel.errors.length > 0) {
      return res.status(categoryModel.status).json({
        errors: categoryModel.errors,
      });
    }

    if (categories !== undefined)
      return res.status(categoryModel.status).json(toTree(categories));
  }

  async Show(req: Request, res: Response) {
    const categoryId: string = req.params.id;

    if (isNaN(Number(categoryId))) {
      return res.status(400).json({
        errors: ['Param id must be an integer'],
      });
    }

    const category = await categoryModel.getById(Number(categoryId));

    if (categoryModel.errors.length > 0) {
      return res.status(categoryModel.status).json({
        errors: categoryModel.errors,
      });
    }

    return res.status(categoryModel.status).json(category);
  }

  async Store(req: Request, res: Response) {
    const category: CategoryParams = { ...req.body };

    await categoryModel.register(category);

    if (categoryModel.errors.length > 0) {
      return res.status(categoryModel.status).json({
        errors: categoryModel.errors,
      });
    }

    return res.status(categoryModel.status).json({
      success: 'Category successfully registered',
    });
  }

  async Update(req: Request, res: Response) {
    const category: CategoryParams = { ...req.body };
    const categoryId: string = req.params.id;

    if (isNaN(Number(categoryId))) {
      return res.status(400).json({
        errors: ['Param id must be an integer'],
      });
    }

    await categoryModel.edit({ ...category, id: Number(categoryId) });

    if (categoryModel.errors.length > 0) {
      return res.status(categoryModel.status).json({
        errors: categoryModel.errors,
      });
    }

    return res.status(categoryModel.status).json({
      success: 'Category successfully edited',
    });
  }

  async Destroy(req: Request, res: Response) {
    const categoryId: string = req.params.id;

    if (isNaN(Number(categoryId))) {
      return res.status(400).json({
        errors: ['Param id must be an integer'],
      });
    }

    await categoryModel.remove(Number(categoryId));

    if (categoryModel.errors.length > 0) {
      return res.status(categoryModel.status).json({
        errors: categoryModel.errors,
      });
    }

    return res.status(categoryModel.status).json({
      success: 'Category successfully removed',
    });
  }
}

export default new CategoryController();
