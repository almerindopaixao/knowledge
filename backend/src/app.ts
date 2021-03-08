import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import UserRouter from './routes/User';
import CategoryRouter from './routes/Category';
import ArticleRouter from './routes/Article';
import AuthRouter from './routes/Auth';
import StatRouter from './routes/stat';
import LoginRiquired from './middlewares/LoginRiquired';

import mongodb from './database/mongodb';

dotenv.config();

class App {
  public app = express();

  constructor() {
    this.middlewares();
    this.routers();
    this.connectDB();
  }

  middlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(helmet());
  }

  routers() {
    this.app.use(AuthRouter);
    this.app.use(LoginRiquired);
    this.app.use(UserRouter);
    this.app.use(CategoryRouter);
    this.app.use(ArticleRouter);
    this.app.use(StatRouter);
  }

  connectDB() {
    mongodb
      .then(() => {
        this.app.emit('mongodb connected');
        const msg = '> Connection established with mongodb';
        console.log('\x1b[44m%s\x1b[37m', msg, '\x1b[0m');
      })
      .catch(() => {
        const msg = '> Error! Could not connect with mongo db';
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m');
      });
  }
}

export default new App().app;
