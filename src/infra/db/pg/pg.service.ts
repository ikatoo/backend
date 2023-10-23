import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';
import { env } from 'process';

@Injectable()
export class PgService implements OnModuleInit {
  constructor(private client: Client) {}
  onModuleInit() {
    this.client = new Client({
      host: env.POSTGRES_HOSTNAME,
      database: env.POSTGRES_DBNAME,
      port: +env.POSTGRES_PORT,
      password: env.POSTGRES_PASSWORD,
      user: env.POSTGRES_USER,
    });
  }

  readonly connect = this.client.connect;

  readonly end = this.client.end;

  readonly query = this.client.query;
}
