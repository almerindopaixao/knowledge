import { Request, Response } from 'express';
import db from '../database/postgresql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as Yup from 'yup';
import validator from '../utils/Validator';
import { tokenExpires } from '../config/variables';
interface UserTable {
  id: number;
  name: string;
  email: string;
  password: string;
  admin: boolean;
}

class AuthController {
  async Validate(req: Request, res: Response) {
    const errors = [];
    try {
      const userData = req.body || null;

      validator.existsOrError(userData, 'Data not provided');

      const decoded = jwt.decode(userData.token, { complete: true }) as {
        expires: number;
      };

      if (!decoded) return res.status(400).json({ valid: false });

      if (new Date(decoded.expires * 1000) > new Date()) {
        return res.status(200).json({ valid: true });
      }
    } catch (err) {
      if (typeof err === 'string') {
        errors.push(err);
      }

      return res.status(400).json({ valid: false, errors: errors });
    }

    return res.status(401).json({ valid: false });
  }
  async Store(req: Request, res: Response) {
    const errors = [];
    let status = 200;
    const { email, password } = req.body;

    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Email invalid')
          .required('Email not provided'),
        password: Yup.string().required('Password not provided'),
      });

      await schema.validate(
        { email, password },
        {
          abortEarly: false,
        },
      );

      const user = await db<UserTable>('users').where({ email }).first();

      validator.existsOrError(user, 'Email invalid');

      const isMatch = bcrypt.compareSync(
        String(password),
        user?.password as string,
      );

      validator.existsOrError(isMatch, 'Password invalid');

      const now = Math.floor(Date.now() / 1000);

      const payload = {
        id: user?.id,
        email: user?.email,
        admin: user?.admin,
        iat: now,
        expires: now + tokenExpires,
      };

      const token = jwt.sign(payload, process.env.AUTH_SECRET as string, {
        expiresIn: tokenExpires,
      });

      return res.status(status).json({ ...payload, token });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        err.errors.forEach((error) => {
          status = 400;
          errors.push(error);
        });
      }

      if (typeof err === 'string') {
        if (err == 'Email invalid') status = 400;
        if (err == 'Password invalid') status = 401;
        errors.push(err);
      }

      console.log(err);

      return res.status(status).json(errors);
    }
  }
}

export default new AuthController();
