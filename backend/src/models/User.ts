import bcrypt from 'bcrypt';
import * as Yup from 'yup';
import db from '../database/postgresql';
import validator from '../utils/Validator';

interface UserData {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  admin?: boolean;
}

interface UserTable {
  id: number;
  name: string;
  email: string;
  password: string;
  admin: boolean;
  deletedAt: Date;
}

class UserModel {
  public errors: string[];
  public status: number;

  constructor() {
    this.errors = [];
    this.status = 200;
  }

  async get() {
    try {
      this.errors = [];
      const users = await db<UserTable>('users')
        .select('id', 'name', 'email', 'admin')
        .whereNull('deletedAt')
        .orderBy('id', 'asc');

      validator.existsOrError(users, 'There are no registered users');

      this.status = 200;
      return users;
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
      const user = await db<UserTable>('users')
        .select('id', 'name', 'email', 'admin')
        .where({ id })
        .whereNull('deletedAt')
        .first();

      validator.existsOrError(user, 'User not found');

      this.status = 200;
      return user;
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

  async register(user: UserData): Promise<void> {
    try {
      this.errors = [];
      const isValid = await this.validateUser(user);
      if (!isValid) return;

      const hashPassword = this.encryptPassword(user.password);
      user.password = hashPassword;
      delete user.confirmPassword;

      await db<UserTable>('users').insert(user);
      this.status = 200;
    } catch (err) {
      this.errors.push('Internal server error');
      this.status = 500;
    }
  }

  async edit(user: UserData): Promise<void> {
    try {
      this.errors = [];
      const isValid = await this.validateUser(user);
      if (!isValid) return;

      const hashPassword = this.encryptPassword(user.password);
      user.password = hashPassword;
      delete user.confirmPassword;

      await db<UserTable>('users')
        .update(user)
        .where({ id: user.id })
        .whereNull('deletedAt');
      this.status = 200;
    } catch (err) {
      this.errors.push('Internal server error');
      this.status = 500;
    }
  }

  async remove(userId: number) {
    try {
      this.errors = [];
      const articles = await db('articles').where({ userId });

      validator.notExistsOrError(articles, 'User contain articles');

      const rowsUpdated = await db<UserTable>('users')
        .update({
          deletedAt: new Date(),
        })
        .where({ id: userId });

      validator.existsOrError(rowsUpdated, 'User not found');

      this.status = 200;
    } catch (err) {
      if (typeof err === 'string') {
        this.errors.push(err);
        this.status = 400;
        return;
      } else {
        this.errors.push('Internal server error');
        this.status = 500;
      }
    }
  }

  private async validateUser(user: UserData) {
    let isValid = true;

    try {
      const schema = Yup.object().shape({
        id: Yup.string(),
        name: Yup.string().required('Name not provided'),
        email: Yup.string()
          .email('Email invalid')
          .required('Email not provided'),
        password: Yup.string().required('Password not provided'),
        confirmPassword: Yup.string()
          .test('assa', 'Passwords do not equals', (value) => {
            const { password } = user;
            return password === value;
          })
          .required('Confirm Password not provided'),
        admin: Yup.boolean().default(false),
      });

      await schema.validate(user, {
        abortEarly: false,
      });

      if (!(await this.userIsExists(user.email))) {
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

  private async userIsExists(email?: string): Promise<boolean> {
    let isExist = true;
    try {
      const userFromDb = await db<UserTable>('users').where({ email });
      validator.notExistsOrError(userFromDb, 'User already registered');
    } catch (msg) {
      if (typeof msg === 'string') {
        this.errors.push(msg);
      } else {
        this.errors.push('Error finding user');
      }
      isExist = false;
    }
    return isExist;
  }

  private encryptPassword(password?: string): string {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    if (!hash) this.errors.push('Error hashing password');

    return hash;
  }
}

export default new UserModel();
