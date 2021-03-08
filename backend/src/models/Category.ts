import * as Yup from 'yup';
import db from '../database/postgresql';
import validator from '../utils/Validator';

interface CategoryData {
  id?: number;
  name?: string;
  parentId: number;
}

interface CategoryTable {
  id: number;
  name: string;
  parentId: number | null;
}

class CategoryModel {
  public errors: string[];
  public status: number;

  constructor() {
    this.errors = [];
    this.status = 200;
  }

  async get() {
    try {
      this.errors = [];
      const categories = await db<CategoryTable>('categories');

      validator.existsOrError(categories, 'There are no registered categories');

      this.status = 200;
      return categories;
    } catch (err) {
      if (typeof err === 'string') {
        this.errors.push(err);
        this.status = 400;
      } else {
        this.errors.push('Internal server error');
        this.status = 500;
      }
    }
  }

  async getById(id: number) {
    try {
      this.errors = [];
      const category = await db<CategoryTable>('categories')
        .where({ id })
        .first();

      validator.existsOrError(category, 'Category not found');

      this.status = 200;
      return category;
    } catch (err) {
      this.status = 500;

      if (err.code === '22P02') {
        this.errors.push('Id must be an integer');
        return;
      }

      if (typeof err === 'string') {
        this.errors.push(err);
        this.status = 400;
        return;
      }

      this.errors.push('Internal server error');
    }
  }

  async register(category: CategoryData): Promise<void> {
    try {
      this.errors = [];
      const isValid = await this.validateCategory(category);
      if (!isValid) return;

      await db<CategoryTable>('categories').insert(category);
      this.status = 200;
    } catch (err) {
      this.status = 500;

      if (err.code === '23503') {
        this.errors.push('ParamId is not present in table categories');
        return;
      }

      this.errors.push('Internal server error');
    }
  }

  async edit(category: CategoryData): Promise<void> {
    try {
      this.errors = [];
      const isValid = await this.validateCategory(category);
      if (!isValid) return;

      await db<CategoryTable>('categories')
        .update(category)
        .where({ id: category.id });
      this.status = 200;
    } catch (err) {
      this.errors.push('Internal server error');
      this.status = 500;
    }
  }

  async remove(id: number) {
    try {
      this.errors = [];
      const subcategory = await db<CategoryTable>('categories').where({
        parentId: id,
      });

      validator.notExistsOrError(subcategory, 'Category contains subcategory');

      const articles = await db('articles').where({ categoryId: id });

      validator.notExistsOrError(articles, 'Category contains articles');

      const rowsDeleted = await db<CategoryTable>('categories')
        .where({
          id,
        })
        .del();

      validator.existsOrError(rowsDeleted, 'Category not found');

      this.status = 200;
    } catch (msg) {
      if (typeof msg === 'string') {
        this.errors.push(msg);
        this.status = 400;
      } else {
        this.errors.push('Internal server error');
        this.status = 500;
      }
    }
  }

  private async validateCategory(category: CategoryData) {
    let isValid = true;

    try {
      const schema = Yup.object().shape({
        id: Yup.number(),
        parentId: Yup.number(),
        name: Yup.string()
          .required('Name not provided')
          .max(20, 'Name field must contain between 3 and 20 characters')
          .min(3, 'Name field must contain between 3 and 20 characters'),
      });

      await schema.validate(category, {
        abortEarly: false,
      });

      if (!(await this.categoryIsExists(category.name))) {
        isValid = false;
        this.status = 400;
        return;
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        err.errors.forEach((error) => {
          this.errors.push(error);
        });
      }

      this.status = 400;
      isValid = false;
    }

    return isValid;
  }

  private async categoryIsExists(name?: string): Promise<boolean> {
    let isExist = true;
    try {
      const categoryFromDB = await db<CategoryTable>('categories').where({
        name,
      });
      validator.notExistsOrError(categoryFromDB, 'Category already registered');
    } catch (msg) {
      if (typeof msg === 'string') {
        this.errors.push(msg);
      } else {
        this.errors.push('Error finding category');
      }
      isExist = false;
    }
    return isExist;
  }
}

export default new CategoryModel();
