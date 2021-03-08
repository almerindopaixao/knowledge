import path from 'path';
import 'dotenv/config';

module.exports = {
  client: 'postgresql',
  connection: {
    port: process.env.PG_PORT,
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  },
  debug: true,
  pool: {
    min: 1,
    max: 20,
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
  },
  useNullAsDefault: true,
};
