import { Request, Response } from 'express';
import userModel from '../models/User';

interface UserParams {
  name?: string;
  email?: string;
  password?: string;
  admin?: boolean;
}

class UserController {
  async Index(req: Request, res: Response) {
    const users = await userModel.get();

    if (userModel.errors.length > 0) {
      return res.status(userModel.status).json({
        errors: userModel.errors,
      });
    }

    return res.status(userModel.status).json(users);
  }

  async Show(req: Request, res: Response) {
    const userId: string = req.params.id;

    if (isNaN(Number(userId))) {
      return res.status(400).json({
        errors: ['Param id must be an integer'],
      });
    }

    const user = await userModel.getById(Number(userId));

    if (userModel.errors.length > 0) {
      return res.status(userModel.status).json({
        errors: userModel.errors,
      });
    }

    return res.status(userModel.status).json(user);
  }

  async Store(req: Request, res: Response) {
    const user: UserParams = { ...req.body };

    if (!req.originalUrl.startsWith('/users')) user.admin = false;
    if (!req.headers.admin) user.admin = false;

    await userModel.register(user);

    if (userModel.errors.length > 0) {
      return res.status(userModel.status).json({
        errors: userModel.errors,
      });
    }

    return res.status(userModel.status).json({
      success: 'User successfully registered',
    });
  }

  async Update(req: Request, res: Response) {
    const user: UserParams = { ...req.body };
    const userId: string = req.params.id;

    if (isNaN(Number(userId))) {
      return res.status(400).json({
        errors: ['Param id must be an integer'],
      });
    }

    await userModel.edit({ ...user, id: Number(userId) });

    if (userModel.errors.length > 0) {
      return res.status(userModel.status).json({
        errors: userModel.errors,
      });
    }

    return res.status(userModel.status).json({
      success: 'User successfully edited',
    });
  }

  async Destroy(req: Request, res: Response) {
    const userId: string = req.params.id;

    if (isNaN(Number(userId))) {
      return res.status(400).json({
        errors: ['Param id must be an integer'],
      });
    }

    await userModel.remove(Number(userId));

    if (userModel.errors.length > 0) {
      return res.status(userModel.status).json({
        errors: userModel.errors,
      });
    }

    return res.status(userModel.status).json({
      success: 'User successfully removed',
    });
  }
}

export default new UserController();
