import { env } from 'process';
import 'dotenv/config';

export default {
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  host: env.POSTGRES_HOSTNAME,
  port: +env.POSTGRES_PORT,
  database: env.POSTGRES_DBNAME,
  idleTimeoutMillis: 100,
};
