import * as Yup from 'yup';
import db from '../database/postgresql';
import { categoryWithChildren } from '../database/queries';
import validator from '../utils/Validator';
import { limit } from '../config/variables';

interface ArticleData {
  id?: number;
  name?: string;
  description?: string;
  imageUrl?: string;
  content?: string;
  userId?: number;
  categoryId?: number;
}

interface ArticleTable {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  content: string;
  userId: number;
  categoryId: number;
}

class CategoryModel {
  public errors: string[];
  public status: number;

  constructor() {
    this.errors = [];
    this.status = 200;
  }

  async get(page: number) {
    try {
      this.errors = [];
      const result = (await db<ArticleTable>('articles')
        .count('id')
        .first()) as { count: string };

      const count = parseInt(result.count);

      const articles = await db<ArticleTable>('articles')
        .select('id', 'name', 'description')
        .limit(limit)
        .offset(page * limit - limit);

      validator.existsOrError(articles, 'There are no registered articles');

      this.status = 200;
      return { data: articles, count, limit };
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
      const article = await db<ArticleTable>('articles').where({ id }).first();

      validator.existsOrError(article, 'Article not found');

      this.status = 200;
      return article;
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

  async getByCategory(categoryId: number, page: number) {
    try {
      this.errors = [];

      await this.categoryIsExists(categoryId);

      if (this.errors.length) {
        this.status = 400;
        return;
      }

      const categories: { rows: { id: string }[] } = await db.raw(
        categoryWithChildren,
        categoryId,
      );
      const ids = categories.rows.map((c) => c.id);

      const articles = await db({ a: 'articles', u: 'users' })
        .select('a.id', 'a.name', 'a.description', 'a.imageUrl', {
          author: 'u.name',
        })
        .limit(limit)
        .offset(page * limit - limit)
        .whereRaw('?? = ??', ['u.id', 'a.userId'])
        .whereIn('categoryId', ids)
        .orderBy('a.id', 'desc');

      validator.existsOrError(articles, 'Category not contains articles');
      this.status = 200;

      return articles;
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

  async register(article: ArticleData): Promise<void> {
    try {
      this.errors = [];
      await this.validateArticle(article);
      if (this.errors.length) {
        this.status = 400;
        return;
      }

      await db<ArticleTable>('articles').insert(article);
      this.status = 200;
    } catch (err) {
      this.status = 500;

      if (err.code === '23503') {
        this.errors.push(
          'userId or categoryID is not present in table articles',
        );
        return;
      }

      this.errors.push('Internal server error');
    }
  }

  async edit(article: ArticleData): Promise<void> {
    try {
      this.errors = [];
      await this.validateArticle(article);
      if (this.errors.length) {
        this.status = 400;
        return;
      }

      await db<ArticleTable>('articles')
        .update(article)
        .where({ id: article.id });
      this.status = 200;
    } catch (err) {
      this.errors.push('Internal server error');
      this.status = 500;
    }
  }

  async remove(id: number) {
    try {
      this.errors = [];

      const rowsDeleted = await db<ArticleTable>('articles')
        .where({
          id,
        })
        .del();

      validator.existsOrError(rowsDeleted, 'Article not found');

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

  private async validateArticle(article: ArticleData) {
    let isValid = true;

    try {
      const schema = Yup.object().shape({
        id: Yup.number(),
        name: Yup.string()
          .required('Name not provided')
          .max(50, 'Name field must contain between 3 and 20 characters')
          .min(3, 'Name field must contain between 3 and 20 characters'),
        description: Yup.string().required('Description not provided'),
        imageUrl: Yup.string(),
        content: Yup.string().required('Content not provided'),
        userId: Yup.number().required('userId not provided'),
        categoryId: Yup.number().required('categoryId not provided'),
      });

      await schema.validate(article, {
        abortEarly: false,
      });

      await this.categoryIsExists(article.categoryId);

      await this.userIsExists(article.userId);
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

  private async categoryIsExists(categoryId?: number): Promise<void> {
    try {
      const userFromDb = await db('categories').where({ id: categoryId });
      validator.existsOrError(userFromDb, 'Category not exists');
    } catch (msg) {
      if (typeof msg === 'string') {
        this.errors.push(msg);
      } else {
        this.errors.push('Error finding category');
      }
    }
  }

  private async userIsExists(userId?: number): Promise<void> {
    try {
      const userFromDb = await db('users').where({ id: userId });
      validator.existsOrError(userFromDb, 'User not exists');
    } catch (msg) {
      if (typeof msg === 'string') {
        this.errors.push(msg);
      } else {
        this.errors.push('Error finding user');
      }
    }
  }
}

export default new CategoryModel();
