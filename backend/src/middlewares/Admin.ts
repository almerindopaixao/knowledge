import { Request, Response, NextFunction, RequestHandler } from 'express';

export default (middleware: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const admin = Boolean(req.headers.admin);
    if (admin) {
      middleware(req, res, next);
    } else {
      res.status(401).json({ errors: ['User is not an administrator'] });
    }
  };
};
