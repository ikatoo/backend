import { env } from 'process';
import 'dotenv/config';

export default {
  host: env.POSTGRES_HOSTNAME,
  database: env.POSTGRES_DBNAME,
  port: +env.POSTGRES_PORT,
  password: env.POSTGRES_PASSWORD,
  user: env.POSTGRES_USER,
};
