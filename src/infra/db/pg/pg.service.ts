import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { env } from 'process';

@Injectable()
export class PgService {
  async getClient() {
    return new Client({
      host: env.POSTGRES_HOSTNAME,
      database: env.POSTGRES_DBNAME,
      port: +env.POSTGRES_PORT,
      password: env.POSTGRES_PASSWORD,
      user: env.POSTGRES_USER,
    });
  }
}
