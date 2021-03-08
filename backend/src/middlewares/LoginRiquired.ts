import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import db from '../database/postgresql';

interface UserTable {
  id: number;
  name: string;
  email: string;
  password: string;
  admin: boolean;
}

export default async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      errors: ['Login riquired'],
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const data = jwt.verify(token, process.env.AUTH_SECRET as string);

    const { id, email } = data as { id: number; email: string };

    const user = await db<UserTable>('users')
      .where('users.email', '=', email)
      .where('users.id', '=', id)
      .select('*')
      .first();

    if (!user) {
      return res.status(500).json({
        errors: ['Internal server error'],
      });
    }

    if (user.admin) {
      req.headers.admin = 'true';
    } else {
      req.headers.admin = '';
    }

    return next();
  } catch (e) {
    return res.status(401).json({
      errors: ['Expired or invalid token'],
    });
  }
};
