import Knex from 'knex';
import 'dotenv/config';

const config = {
  client: 'pg',
  connection: {
    port: process.env.PG_POR0T as string,
    host: process.env.PG_HOST as string,
    user: process.env.PG_USER as string,
    password: process.env.PG_PASSWORD as string,
    database: process.env.PG_DATABASE as string,
  },
  useNullAsDefault: true,
};

const db = Knex(config);

// db.migrate.latest([config]);

export default db;
