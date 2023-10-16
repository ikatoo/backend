import { DataSource } from 'typeorm';
import 'dotenv/config';
import { env } from 'process';

export default new DataSource({
  type: 'postgres',
  host: env.POSTGRES_HOSTNAME,
  port: 5432,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DBNAME,
  entities: [__dirname + '/../**/*.entity.ts'],
  migrations: [__dirname + '/../**/migrations/*.ts'],
  synchronize: true,
});
